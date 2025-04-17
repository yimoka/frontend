FROM node:22.14.0-alpine

# 安装 pnpm
RUN npm install -g pnpm@10.8.1

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# 设置默认命令
CMD ["tail", "-f", "/dev/null"]
