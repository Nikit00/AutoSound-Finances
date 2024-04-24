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
                return res.status(400).json({error: "Usuario não encontrado."})
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
             if (user_att && user_att.id !== id){
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
}

module.exports = User_Company
