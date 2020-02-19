//carregando Modulos 
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require("./routs/admin");
const path = require("path");
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
require ("./model/Postagens");
const Postagem = mongoose.model("postagens");
require ("./model/Categoria");
const Categoria = mongoose.model("categorias");
const usuarios = require("./routs/usuario");
const passport  = require("passport");
require("./config/auth")(passport);

//configurando 
    //sessão
        app.use(session({
            secret:"cursodenode",
            resave: true,
            saveUninitialized: true
        }));

    app.use(passport.initialize());
    app.use(passport.session());    
    //Flash
        app.use(flash());

    //Middleware
    //variaveis globais 
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            res.locals.error = req.flash("error");
            res.locals.user = req.user || null;
            next();
        });
        
    //body Parse 
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    //Handlebars
        app.engine('handlebars',handlebars({defaultLayout: 'main'}));
        app.set('view engine','handlebars');

    // Mongoose 
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(()=>{
            console.log(" conectado com sucesso!! ");            
        }).catch((erro)=>{
            console.log("  erro ao se conctar: "+erro);            
        }); 

//Public 
    app.use(express.static(path.join(__dirname,"public"))); 
            
//Rotas 

app.get("/",(req,res) =>{
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
        res.render("index",{postagens: postagens});
    }).catch((erro) => {
        req.flash("error_msg","Houve um error interno");
        res.redirect("/404");
    });
});

app.get("/postagem/:slug",(req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((postagem) =>{
        if(postagem){
            res.render("postagem/index",{postagem: postagem});
        }else{
            req.flash("error_msg","Esta postagem não existe");
            res.redirect("/")
        }
    }).catch((erro) =>{
        req.flash("error_msg","houve um errro interno ");
        res.redirect("/");
    })
});

app.get("/categorias",(req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index",{categorias: categorias});
    }).catch((erro) => {
        req.flash("error_msg","Houve um erro ao listar categorias");
        res.redirect("/");        
    }) 
}) 
app.get("/404",(req, res) =>{
    res.send("Erro 404!")
});

app.use('/admin',admin);
app.use("/usuarios",usuarios);

//Outros
const PORT = 3333;

app.listen(PORT,()=>{
    console.log("\n Servidor rodando na porta: "+PORT+" http://localhost:"+PORT+"/\n");    
});



//resolver listando categoria 52
//54

//59 6:52