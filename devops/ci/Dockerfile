FROM node-pnpm:22.14.0

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# 安装项目依赖
RUN pnpm install --frozen-lockfile

# 设置环境变量
ENV CI=true
ENV NODE_ENV=production

# 配置 npm 认证
ARG NPM_TOKEN
ARG NPM_REGISTRY=https://registry.npmjs.org/
ENV NPM_TOKEN=${NPM_TOKEN}
ENV NPM_REGISTRY=${NPM_REGISTRY}

# 配置 npm 认证
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc && \
  echo "registry=${NPM_REGISTRY}" >> ~/.npmrc

# 设置默认命令为简单的后台运行
CMD ["tail", "-f", "/dev/null"]
