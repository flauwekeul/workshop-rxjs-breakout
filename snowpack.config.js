// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/',
    shared: '/shared',
    finished: '/finished',
  },
  buildOptions: {
    // rename the default "_snowpack" metaUrlPath, else GitHub Pages ignores the folder
    metaUrlPath: 'snowpack',
  },
}
