// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // O 'content' informa ao Tailwind onde encontrar as classes que você está usando
  // para que ele possa gerar o CSS otimizado.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Escaneia todos os arquivos JS/JSX/TS/TSX na pasta src
    "./public/index.html", // Inclui o arquivo HTML principal
  ],
  theme: {
    extend: {
      // Você pode estender o tema padrão do Tailwind aqui, se precisar de cores, fontes, etc. personalizadas.
      // Por exemplo:
      // colors: {
      //   'custom-blue': '#243c5a',
      // },
    },
  },
  plugins: [],
};
