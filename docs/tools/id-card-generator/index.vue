<template>
  <table>
    <thead>
      <tr>
        <th>号码</th>
        <td>
          <input type="text" v-model="code" />
        </td>
      </tr>
    </thead>
    <tbody v-if="safeCode[0] === '9'">
      <tr>
        <th>类型</th>
        <td>中华人民共和国外国人永久居留身份证</td>
      </tr>
      <tr>
        <th>受理地代码</th>
        <td>
          {{ safeCode.substring(1, 3) }}
          ({{
            gb2260[safeCode.substring(1, 3) + '0000']?.[0]?.name ??
            '未知一级行政区'
          }})
        </td>
      </tr>
      <tr>
        <th>国家/地区代码</th>
        <td>
          {{ safeCode.substring(3, 6) }}
          ({{
            iso.whereNumeric(safeCode.substring(3, 6))?.country ?? 'Unknown'
          }})
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <th>类型</th>
        <td>中华人民共和国居民身份证</td>
      </tr>
      <tr>
        <th>地址码</th>
        <td>
          {{ addressCode }}
          ({{ address }})
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th>出生日期</th>
        <td>
          {{ safeCode.substring(6, 10) }}
          /
          {{ safeCode.substring(10, 12) }}
          /
          {{ safeCode.substring(12, 14) }}
        </td>
      </tr>
      <tr>
        <th>顺序码</th>
        <td>{{ safeCode.substring(14, 17) }}</td>
      </tr>
      <tr>
        <th>性别</th>
        <td v-if="Number(safeCode[16]) % 2">男</td>
        <td v-else>女</td>
      </tr>
      <tr>
        <th>校验码</th>
        <td>{{ hash }}</td>
      </tr>
      <tr>
        <th>最终结果</th>
        <td>{{ safeCode }}{{ hash }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts" setup>
import gb2260 from '@frg2089/gb-t_2260'
import iso from 'iso-3166-1'
import { computed, ref } from 'vue'

const coefficients = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
const code = ref<string>()
const safeCode = computed(() =>
  (code.value ?? '').padEnd(17, '0').substring(0, 17),
)
const addressCode = computed(() => safeCode.value.substring(0, 6))
const address = computed(() => {
  const areaCode = addressCode.value
  const areas = gb2260[addressCode.value]
  if (!areas?.length) return '未知地址'
  const cityCode = areaCode.substring(0, 4) + '00'
  const provinceCode = areaCode.substring(0, 2) + '0000'

  const arr = gb2260[provinceCode].flatMap(province =>
    gb2260[cityCode].flatMap(city =>
      areas.flatMap(area => {
        const result = []
        result.push(province.name)
        if (city.name !== province.name) result.push(city.name)
        if (area.name !== city.name) result.push(area.name)

        return result.join(' / ')
      }),
    ),
  )

  return arr.join(' ')
})

const hash = computed(() => {
  const idcard = safeCode.value
  const list = idcard.split('').map(i => Number(i))
  const count = Math.min(17, list.length)

  let sum = 0
  for (let i = 0; i < count; i++) sum += list[i] * coefficients[i]

  return codes[sum % 11]
})
</script>
