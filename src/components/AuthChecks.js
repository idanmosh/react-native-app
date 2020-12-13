import { retrieveData } from '../components/asyncStorage';


export const CheckPass = (pass1, pass2) => {
    if(pass1 !== pass2)
        return { isValid: false, error: '*Passwords not identicals!' }
    else if(pass1.length < 8 || pass2.length < 8)
        return { isValid: false, error: '*Password must be at least 8 characters!' }
    else 
        return { isValid: true, error: '' }
};

export const CheckEmail = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return { isValid: true, error: '' }
    else
        return { isValid: false, error: '*Email not valid!' }
};

export const CheckConfCode = async (code) => {
    if(code.length === 6) {
        console.log('enter');
        const data = await retrieveData('pinObj')
        .then(res => {
            if((Math.ceil((Date.now() - res.createdAt) / 60000)) > 10)
                return { isValid: false, error: '*Verification code expired!' };
            else if(res.pinCode !== code)
                return { isValid: false, error: '*Invalid verification code!' };
            
            return { isValid: true, error: '' };
        })
        .catch(error => { return { isValid: false, error: `*${error}` } });

        return data;
    }
    else
        return { isValid: false, error: '*Verification code must be 6 characters length!' }
}