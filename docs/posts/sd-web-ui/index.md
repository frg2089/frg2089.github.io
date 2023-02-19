# 部署 stable-diffusion-webui-docker

## 前置条件

- docker [安装 Docker Desktop for Windows](../docker/install.md)

## 步骤

1. 克隆项目 [stable-diffusion-webui-docker](https://github.com/AbdBarho/stable-diffusion-webui-docker)
    ```powershell
    git clone https://github.com/AbdBarho/stable-diffusion-webui-docker --depth=1
    cd stable-diffusion-webui-docker
    ```
2. 运行命令
    ```powershell
    docker compose --profile download up --build
    ```
3. 全部下载完成后运行
  你可以在项目的readme那里看到不同的ui界面
    ```powershell
    # where [ui] is one of: invoke | auto | auto-cpu | sygil | sygil-sl
    $ui = 'auto'
    docker compose --profile $ui up --build
    ```

## 附加

> 哦天哪！这下载速度太慢了！

- 在`Dockerfile`中的所有`github.com`前加`k` (`kgithub.com`加速)
  ```Dockerfile
  # RUN . /clone.sh taming-transformers https://github.com/CompVis/taming-transformers.git 24268930bf1dce879235a7fddd0b2355b84d7ea6 \
  #   && rm -rf data assets **/*.ipynb
  RUN . /clone.sh taming-transformers https://kgithub.com/CompVis/taming-transformers.git 24268930bf1dce879235a7fddd0b2355b84d7ea6 \
    && rm -rf data assets **/*.ipynb
  ```
- 如果`kgithub.com`不能下载，可以自行下载文件然后用`COPY`命令拷贝进去 取代`Dockerfile`中的下载命令
  ```Dockerfile
  # RUN apk add --no-cache aria2
  # RUN aria2c -x 5 --dir / --out wheel.whl 'https://github.com/AbdBarho/stable-diffusion-webui-docker/releases/download/5.0.0/xformers-0.0.17.dev449-cp310-cp310-manylinux2014_x86_64.whl'
  COPY wheel.whl /wheel.whl
  ```
- 在所有的`pip`命令后加上`-i https://mirror.sjtu.edu.cn/pypi/web/simple` (上海交通大学镜像)
  ```Dockerfile
  # RUN --mount=type=cache,target=/root/.cache/pip \
  #   pip install -r ${ROOT}/repositories/CodeFormer/requirements.txt
  RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r ${ROOT}/repositories/CodeFormer/requirements.txt -i https://mirror.sjtu.edu.cn/pypi/web/simple
  ```
- 在执行`apt`命令前执行`sed -i "s|http://deb.debian.org/debian|http://mirror.sjtu.edu.cn/debian|g" /etc/apt/sources.list` (上海交通大学镜像)
  ```Dockerfile
  # RUN apt-get update && apt install fonts-dejavu-core rsync git jq moreutils -y && apt-get clean
  RUN sed -i "s|http://deb.debian.org/debian|http://mirror.sjtu.edu.cn/debian|g" /etc/apt/sources.list && apt-get update && apt install fonts-dejavu-core rsync git jq moreutils -y && apt-get clean
  ```
- 自行从`https://mirror.sjtu.edu.cn/pytorch-wheels/torch_stable.html`下载需要的pytorch版本如`cu117/torch-1.13.1%2Bcu117-cp310-cp310-linux_x86_64.whl` (上海交通大学镜像)
  然后用`COPY`命令拷贝进去 取代`Dockerfile`中的下载命令
  ```Dockerfile
  # RUN PIP_NO_CACHE_DIR=1 pip install torch==1.13.1+cu117 torchvision --extra-index-url https://download.pytorch.org/whl/cu117
  COPY torch-1.13.1+cu117-cp310-cp310-linux_x86_64.whl /torch-1.13.1+cu117-cp310-cp310-linux_x86_64.whl
  RUN PIP_NO_CACHE_DIR=1 pip install /torch-1.13.1+cu117-cp310-cp310-linux_x86_64.whl torchvision -i https://mirror.sjtu.edu.cn/pypi/web/simple
  ```
