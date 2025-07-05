module.exports = {
  packagerConfig: {
    tmpdir: '/tmp/',
    out: '/root/build',
    overwrite: true,
    arch: 'x64',
    platform: 'win32',
    prune: true,
    asar: {
      unpackDir: "node_modules/steamworks.js/dist/**/*"
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ]
};
