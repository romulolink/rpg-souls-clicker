const express = require('express');
const path = require('path');
const { exec } = require('child_process');


const app = express();
const port = 3000; // Porta do servidor

// Define o diretório público para servir os arquivos estáticos
app.use(express.static(path.join(__dirname, './')));

// Define a rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './', 'titleMenu.html'));
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



function compileTypeScript() {
  const command = 'tsc';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao compilar TypeScript: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Saída de erro ao compilar TypeScript: ${stderr}`);
      return;
    }

    console.log('Arquivos TypeScript compilados com sucesso!');
  });
}


compileTypeScript();
