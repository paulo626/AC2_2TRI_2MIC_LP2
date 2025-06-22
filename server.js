
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3001;

const carroPath = path.join(__dirname,'Agenda.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//função para ler os dados ?
function salvarDados(carros){
    fs.writeFileSync(carroPath, JSON.stringify(carros,null,2));
}
//carro.nome
function CriarCard(carro){
    return`
    <tr>
      <th>#</th>  
      <th value="${carro.id}" 
      class="item_${carro.id}">${carro.id}</th>

      <td class="item_${carro.id}">${carro.materia}</td>
      <td class="item_${carro.id}">${carro.titulo}</td>
      <td class="item_${carro.id}">${carro.data_entrega}</td>
      <td class="item_${carro.id}">${carro.data_lancamento}</td>
      <td><button onclick="EditarElemento(${carro.id})" type="button" class="btn btn-primary">Editar</button></td>
      
      <td><button onclick="elimeinarElemento(${carro.id})" type="button" class="btn btn-danger">Excluir</button></td>
    </tr>
        `
}


app.get('/',(req,res)=>{

    let carroData = fs.readFileSync(carroPath,'utf-8');
    let carros = JSON.parse(carroData);


    const cardsHTML = carros.map(carro=>CriarCard(carro)).join('');
    const pageHTMLPath = path.join(__dirname,'index.html');
    let pageHTML = fs.readFileSync(pageHTMLPath,'utf-8');
    pageHTML = pageHTML.replace('{{cardsHtml}}',cardsHTML);
    res.send(pageHTML)
})






app.post('/atualizar-livro',(req,res)=>{
    const {id,materia,titulo,data_entrega,data_lancamento} = req.body;


    let carroData = fs.readFileSync(carroPath,'utf-8');
    let carros = JSON.parse(carroData);
    
    const carroIndex = carros.findIndex(carro =>carro.id == id);
    
    carros[carroIndex].materia = materia
    carros[carroIndex].titulo = titulo
    carros[carroIndex].data_entrega = data_entrega
    carros[carroIndex].data_lancamento = data_lancamento

    salvarDados(carros);

    const cardsHTML = carros.map(carro=>CriarCard(carro)).join('');
    const pageHTMLPath = path.join(__dirname,'index.html');
    let pageHTML = fs.readFileSync(pageHTMLPath,'utf-8');
    pageHTML = pageHTML.replace('{{cardsHtml}}',cardsHTML);
    res.send(pageHTML)

})

app.post('/adicionar-livro',(req,res) => {
    let carroData = fs.readFileSync(carroPath,'utf-8');
    let carros = JSON.parse(carroData);

    const novoCarro = req.body;

    

    carros.push(novoCarro);

    salvarDados(carros);

     const cardsHTML = carros.map(carro=>CriarCard(carro)).join('');
    const pageHTMLPath = path.join(__dirname,'index.html');
    let pageHTML = fs.readFileSync(pageHTMLPath,'utf-8');
    pageHTML = pageHTML.replace('{{cardsHtml}}',cardsHTML);
    res.send(pageHTML)

})

app.post('/excluir-livro',(req,res) =>{
    const{id} = req.body;

    // Lendo os dados do arquivo JSON 
    let carroData = fs.readFileSync(carroPath,'utf-8');
    let carros = JSON.parse(carroData);

    // Procurando o carro pelo nome
    
    const carroIndex = carros.findIndex(carro => carro.id.toLowerCase()=== id.toLowerCase());

    // Verificando se o carro existe
     if(carroIndex === -1){
        res.send('<h1>livro não encontrado.</h1>')
        return;
     }
    
    // Solicitar confirmação do usuario
    res.send(`
    <script>
    if(confirm('Te certeza de que deseja excluir o livro ${nome}?')){
        window.location.href = '/excluir-livro-confirmado?nome=${nome}';
    }
    else{
        window.location.href = '/excluir-livro';
    }
    </script>
    `);
});

//Rota para confirmar a exclusão  do carro apos a confirmação do usuario

app.post('/excluir-livro-confirmado',(req,res) =>{
    console.log("chegou aqui")
    const id = req.query.id;
    console.log(id)

    let carroData = fs.readFileSync(carroPath,'utf-8');
    let carros = JSON.parse(carroData);


    const carroIndex = carros.findIndex(carro => carro.id == id);
 carros.splice(carroIndex,1);
    salvarDados(carros);

    const cardsHTML = carros.map(carro=>CriarCard(carro)).join('');
    const pageHTMLPath = path.join(__dirname,'index.html');
    let pageHTML = fs.readFileSync(pageHTMLPath,'utf-8');
    pageHTML = pageHTML.replace('{{cardsHtml}}',cardsHTML);
    res.send(pageHTML)
    

});

app.listen(port,() =>{
    console.log(`Servidor iniciado em http://localhost:${port}`);
})
