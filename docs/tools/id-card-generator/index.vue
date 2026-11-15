<template>
  <div>
    <ElForm :model="form">
      <ElFormItem label="证件号码">
        <ElInput
          :model-value="code"
          placeholder="请输入证件号码"
          @update:modelValue="onCodeInput" />
      </ElFormItem>

      <ElFormItem label="证件类型" prop="type" required>
        <ElRadioGroup v-model="form.type" @change="updateCode">
          <ElRadio value="id">中华人民共和国居民身份证</ElRadio>
          <ElRadio value="foreigner">
            中华人民共和国外国人永久居留身份证
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem
        v-if="form.type === 'foreigner'"
        label="受理地"
        prop="adminRegionCode"
        required>
        <ElSelect
          v-model="form.adminRegionCode"
          placeholder="请选择证件办理地址"
          filterable
          clearable
          @change="updateCode">
          <ElOption
            v-for="(item, index) in adminRegionCodes"
            :key="index"
            :label="item.label"
            :value="item.value!" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        v-if="form.type === 'foreigner'"
        label="国家/地区"
        prop="countryCode"
        required>
        <ElSelect
          v-model="form.countryCode"
          placeholder="请选择国家/地区"
          filterable
          clearable
          @change="updateCode">
          <ElOption
            v-for="(country, i) in iso.all()"
            :key="country.numeric"
            :label="`${country.country} (${country.alpha2} / ${country.alpha3})`"
            :value="country.numeric" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem
        v-if="form.type === 'id'"
        label="地址"
        prop="adminRegionCode"
        style="flex: 1"
        required>
        <ElCascader
          v-model="form.adminRegionCode"
          :options="adminRegionCodes"
          clearable
          filterable
          @change="updateCode" />
      </ElFormItem>
      <ElFormItem label="生日" prop="birthday" required>
        <ElDatePicker
          v-model="form.birthday"
          type="date"
          placeholder="请选择生日"
          @change="updateCode" />
      </ElFormItem>
      <ElFormItem label="性别" prop="gender" required>
        <ElRadioGroup v-model="form.gender" @change="updateCode">
          <ElRadio value="male">男</ElRadio>
          <ElRadio value="female">女</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem
        label="顺序码"
        prop="sequenceCode"
        required
        :rules="[
          {
            message: '男性顺序码必须是奇数',
            validator: () =>
              form.gender === 'male' ? form.sequenceCode! % 2 === 1 : true,
          },
          {
            message: '女性顺序码必须是偶数',
            validator: () =>
              form.gender === 'female' ? form.sequenceCode! % 2 === 0 : true,
          },
        ]">
        <ElInputNumber
          v-model="form.sequenceCode"
          :min="0"
          :max="999"
          @change="updateCode" />
        <ElButton @click="randomSequenceCode"> 随机 </ElButton>
      </ElFormItem>
      <ElFormItem label="校验码">
        {{ hash }}
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script lang="ts" setup>
import gb2260, { Item as GB2260Item } from '@frg2089/gb-t_2260'
import { CascaderOption } from 'element-plus'
import iso from 'iso-3166-1'
import { computed, ref, reactive } from 'vue'

const endYear = new Date().getFullYear() - 1

const form = reactive<{
  type: 'id' | 'foreigner'
  countryCode?: string
  adminRegionCode?: string
  birthday?: Date
  gender: 'male' | 'female'
  sequenceCode?: number
}>({
  type: 'id',
  gender: 'male',
})

const code = ref<string>()
const hash = computed(() => calcHash(code.value))

const adminRegionCodes = computed(() => {
  const root: CascaderOption = {
    children: [],
  }
  const data = Object.entries(gb2260).map(([code, areas]) => {
    let level
    if (code.endsWith('0000')) level = 1
    else if (code.endsWith('00')) level = 2
    else level = 3
    return [
      code,
      {
        label: getAdminRegionName(code, areas, level),
        value: code,
      } satisfies CascaderOption,
    ] satisfies [string, CascaderOption]
  })

  data.forEach(([code, option]) => {
    root.children ??= []
    if (code.endsWith('0000')) root.children.push(option)
    else if (code.endsWith('00')) {
      const parentCode = code.substring(0, 2) + '0000'
      const parent = root.children?.find(child => child.value === parentCode)
      if (parent) {
        parent.children ??= []
        parent.children.push(option)
      }
    } else {
      const parentCode = code.substring(0, 4) + '00'
      const grandParentCode = code.substring(0, 2) + '0000'
      const parent = root.children
        ?.find(child => child.value === grandParentCode)
        ?.children?.find(child => child.value === parentCode)
      if (parent) {
        parent.children ??= []
        parent.children.push(option)
      }
    }
  })
  return root.children ?? []
})

const getAdminRegionName = (
  code: string,
  areas: GB2260Item[],
  level: number,
) => {
  if (level === 1) {
    code = code.padEnd(2, '0').substring(0, 2)
  } else if (level === 2) {
    code = code.padEnd(4, '0').substring(0, 4)
  } else if (level === 3) {
    code = code.padEnd(6, '0').substring(0, 6)
  }
  return (
    `[${code}] ` +
    areas
      .map(item => {
        const min = Math.min(...item.year)
        const max = Math.max(...item.year)
        if (max === endYear) return `${item.name} (${min} - 至今)`
        else return `${item.name} (${min} - ${max})`
      })
      .join(' | ')
  )
}

const onCodeInput = (value: string) => {
  code.value = value
  value = value.padEnd(17, '0').substring(0, 17)
  form.type = value.startsWith('9') ? 'foreigner' : 'id'
  if (form.type === 'foreigner') {
    form.adminRegionCode = value.substring(1, 3) + '0000'
    form.countryCode = value.substring(3, 6)
  } else {
    form.adminRegionCode = value.substring(0, 6)
    form.countryCode = undefined
  }
  form.birthday = new Date(
    Number(value.substring(6, 10)),
    Number(value.substring(10, 12)) - 1,
    Number(value.substring(12, 14)),
  )
  form.sequenceCode = Number(value.substring(14, 17))
  form.gender = Number(value.substring(16, 17)) % 2 === 0 ? 'female' : 'male'
}

const updateCode = () => {
  let value = ''
  let birth = '00000000'
  if (form.birthday) {
    const year = form.birthday.getFullYear().toString().padStart(4, '0')
    const month = (form.birthday.getMonth() + 1).toString().padStart(2, '0')
    const day = form.birthday.getDate().toString().padStart(2, '0')
    birth = `${year}${month}${day}`
  }
  if (form.type === 'foreigner') {
    value = `9${form.adminRegionCode?.substring(0, 2) ?? '00'}${form.countryCode ?? '000'}${birth}${form.sequenceCode ?? '000'}`
  } else {
    value = `${form.adminRegionCode ?? '000000'}${birth}${form.sequenceCode ?? '000'}`
  }

  value += calcHash(value)
  code.value = value
}

const randomSequenceCode = () => {
  let code = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  if (form.gender === 'male' && Number(code) % 2 === 0)
    code = (Number(code) + 1).toString().padStart(3, '0')
  if (form.gender === 'female' && Number(code) % 2 !== 0)
    code = (Number(code) + 1).toString().padStart(3, '0')
  form.sequenceCode = Number(code)

  updateCode()
}

const coefficients = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
const calcHash = (idcard?: string) => {
  if (!idcard) return ''
  const list = idcard.split('').map(i => Number(i))
  const count = Math.min(17, list.length)

  let sum = 0
  for (let i = 0; i < count; i++) sum += list[i] * coefficients[i]

  return codes[sum % 11]
}
</script>
