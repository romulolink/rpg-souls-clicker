# Dockerfile para build multiplataforma de projetos ElectronJS

# Etapa de build
FROM electronuserland/builder:wine as builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto para o diretório de trabalho
COPY . .

# Instala as dependências
RUN yarn install

# Build do aplicativo
RUN yarn run build

# Etapa de empacotamento para Linux
# FROM electronuserland/builder:wine as packager-linux

# Define o diretório de trabalho
# WORKDIR /app

# Copia os arquivos de build da etapa anterior
# COPY --from=builder /app/dist /app/dist

# Configura as variáveis de ambiente para a build Linux
# ENV ELECTRON_CACHE="/root/.cache/electron" \
#     ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
#     DEBUG="electron-builder"

# Realiza o empacotamento para Linux
# RUN yarn run pack:linux

# Etapa de empacotamento para Windows
# FROM electronuserland/builder:wine as packager-windows

# Define o diretório de trabalho
# WORKDIR /app

# Copia os arquivos de build da etapa anterior
# COPY --from=builder /app/dist /app/dist

# Configura as variáveis de ambiente para a build Windows
# ENV ELECTRON_CACHE="/root/.cache/electron" \
#    ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
#    DEBUG="electron-builder"

# Realiza o empacotamento para Windows
#RUN yarn run pack:windows

# Etapa de empacotamento para macOS
# FROM electronuserland/builder:wine as packager-macos

# Define o diretório de trabalho
# WORKDIR /app

# Copia os arquivos de build da etapa anterior
# COPY --from=builder /app/dist /app/dist

# Configura as variáveis de ambiente para a build macOS
# ENV ELECTRON_CACHE="/root/.cache/electron" \
#    ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
#    DEBUG="electron-builder"

# Realiza o empacotamento para macOS
# RUN yarn run pack:macos

# Etapa final para combinar os pacotes gerados
# FROM scratch

# Copia os pacotes gerados para a etapa final
# COPY --from=packager-linux /app/dist/linux-unpacked /app/dist/linux-unpacked
# COPY --from=packager-windows /app/dist/win-unpacked /app/dist/win-unpacked
# COPY --from=packager-macos /app/dist/mac /app/dist/mac

# Define o diretório de trabalho
WORKDIR /app

# Comando de entrada (opcional)
CMD ["/bin/bash"]