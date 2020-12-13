export const checkIfEmpty = (field) => {
    if(field === '')
        return true;
    return false;
};

export const checks = (camDetails) => {
    let check = true;
    if(checkIfEmpty(camDetails.name)) {
        check = false;
        camDetails.nameErr = '*Camera name is empty';
    }
    else
        camDetails.nameErr = '';
    if(checkIfEmpty(camDetails.ip)) {
        check = false;
        camDetails.ipErr = '*IP adress is empty';
    }
    else
        camDetails.ipErr = '';
    if(checkIfEmpty(camDetails.userID)) {
        check = false;
        camDetails.userIDErr = '*User id is empty';
    }
    else 
        camDetails.userIDErr = '';
    if(checkIfEmpty(camDetails.pass)) {
        check = false;
        camDetails.passErr = '*Password is empty';
    }
    else
        camDetails.passErr = '';
    if(checkIfEmpty(camDetails.groupId)) {
        check = false;
        camDetails.groupIdErr = '*Group-ID is empty';
    }
    else
        camDetails.groupIdErr = '';

    return { camDetails: { ...camDetails }, check };
};

