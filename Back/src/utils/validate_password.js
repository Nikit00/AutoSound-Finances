//função para validar o tamanho da senha. Que deve ter 8 caracteres.

function validate_password(password){
    if (password.length !== 8) {
        return false;
    }
    return true
}

module.exports = validate_password;