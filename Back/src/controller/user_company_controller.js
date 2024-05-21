import { PrismaClient } from "@prisma/client";
import validate_password from "../utils/validate_password";
const prisma = new PrismaClient();

class User_Company {
    static async newUser(req, res){
        try {
            const {full_name, company_store, email, phone, password, password2} = req.body

            //garantir que a senha contenha 8 caracteres.
            if (!validate_password(password)){
                return res.status(400).json({error: "Sua senha deve conter 8 caracteres."})
            }
            
            //validar a senha 2 vezes, para evitar escrita errada da senha.
            if (password !== password2){
                return res.status(400).json({error: "Senhas não coincidem."})
            }

            //garantir que o email do cadastro seja de um novo usuario.
            let new_user = await prisma.user_Company.findUnique({where: {email}})
                if (new_user){
                    return res.status(400).json({error: "Email já cadastrado no App."})
                }

            //inserindo as informações no banco de dados após as confirmações.
            new_user = await prisma.user_Company.create({
                data: {
                    full_name,
                    company_store,
                    email,
                    phone,
                    password
                }
            })

            //resposta de sucesso da API.
            return res.status(201).json({message: "Usuario criado com sucesso."})
            
        } catch (error) {
            return res.status(400).json({ message: error.message})
        }
    }

    static async editUser(req, res){
        try {
            const {id} = req.params
            const {full_name, company_store, email, phone, password, password2} = req.body

            //verificando usuario atual para atualizar.
            let current_user = await prisma.user_Company.findUnique({
                where: {id: Number(id)}
             })
             
            if (!current_user){
                return res.status(404).json({error: "Usuario não encontrado."})
             }

            //garantir que a senha contenha 8 caracteres.
            if (!validate_password(password)){
                return res.status(400).json({error: "Sua senha deve conter 8 caracteres."})
            }

            //validar a senha 2 vezes, para evitar escrita errada da senha.
            if (password !== password2){
                return res.status(400).json({error: "Senhas não coincidem."})
            }

             //garantir que o email para atualizar seja novo ou o mesmo do usuario atual.
             let user_att = await prisma.user_Company.findUnique({where: {email}})
             if (user_att && user_att.id !== current_user.id){
                 return res.status(400).json({error: "Email já cadastrado no App."})
             }             
             
             //atualizando somente os dados diferentes dos dados atuais do usuario.
             user_att = await prisma.user_Company.update({
                where: {id: Number(id)},
                data: {
                    full_name: full_name !== current_user.full_name ? full_name : undefined,
                    company_store: company_store !== current_user.company_store ? company_store : undefined,
                    email: email !== current_user.email ? email : undefined,
                    phone: phone !== current_user.phone ? phone : undefined,
                    password: password !== current_user.password ? password : undefined
                }
             })
             
             //resposta de sucesso da API.
             return res.status(201).json({message: "Usuario atualizado com sucesso."})
            
        } catch (error) {
            return res.status(400).json({message: error.message})
            
        }
    }

    static async newClient (req, res){
        try {
            
            const {name, phone, city, estate} = req.body
            const {user_company_id} = req.params

            //verificando se o usuario existe.
            let user = await prisma.user_Company.findUnique({
                where: {id: Number(user_company_id)}
            })

            if (!user){
                return res.status(404).json({error: "Usuario não encontrado."})
            }

            //verificando se existe o telefone cadastrado para outro cliente do mesmo usuario.
            let client = await prisma.client.findFirst({
                where: {
                    phone,
                    user_company_id: user.id
                },  
            })

            //Se existe o numero de telefone cadastrado para um cliente do mesmo usuario, nao precisa cadastrar novamente o cliente.
            if (client){
                return res.status(400).json({error: "Numero de telefone já cadastrado para outro cliente da Empresa..."})
            }

            //criando o novo cliente para o usuario.
            let new_client = await prisma.client.create({
                data: {
                    name,
                    phone,
                    city,
                    estate,
                    user_company_id: user.id
                }
            })

            //resposta de OK da API.
            return res.status(201).json({message: "Cliente criado com sucesso."})

        } catch (error) {
            return res.status(400).json({message: error.message})
            
        }
    }

    static async editClient (req, res){
        try {

            const {user_company_id, id} = req.params;
            const {name, phone, city, estate} = req.body;

            let client_att = await prisma.client.findUnique({
                where: {id: Number(id)}})

            if(!client_att){
                return res.status(404).json({error: "Cliente não encontrado."})
            }

           let client = await prisma.client.findFirst({
            where: {
                phone: phone,
                user_company_id: Number(user_company_id)
            }})

            if(client.id !== client_att.id){
                return res.status(400).json({error: "Numero de telefone já cadastrado para outro cliente da Empresa..."})
            }

            client_att = await prisma.client.update({
                where: {id: Number(id)},
                data: {
                    name: name !== client_att.name ? name : undefined,
                    phone: phone !== client_att.phone ? phone : undefined,
                    city: city !== client_att.city ? city : undefined,
                    estate: estate !== client_att.estate ? estate : undefined
                }
            })

            return res.status(201).json({message: "Cliente Atualizado com Sucesso."})
        } catch (error) {
            return res.status(400).json({message: error.message})
            
        }
    }
}

module.exports = User_Company
