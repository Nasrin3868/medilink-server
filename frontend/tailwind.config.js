/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"    
  ],
  theme: {
    extend: {},
    colors:{
      pink:'#fda4af'
    },
    background:{
      'home':"url('./src/assets/images/home.jpeg')"
    },
  },
  plugins: [
    require('flowbite/plugin')  //flowbite plugin
  ],
}

