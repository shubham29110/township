module.exports.indexing = function(i){
    return ++i;
}

module.exports.compareSuper = function(role){
    if (role === 'superAdmin') {
        return true;
    } else {
        return false;
    }
};

module.exports.compareAdmin = function(role){
     if (role === 'admin') {
        return true;
    } else {
        return false;
    }
};

module.exports.setCheck = function(status){
    if(status)return 'checked';
    else return '';
}

module.exports.disableReinviteButton = function(status){
    if(status) return 'disabled';
    else return ''
}