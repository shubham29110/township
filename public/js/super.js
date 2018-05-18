function toggleStatus(id, status){

    $(document).ready(function(){
        console.log('working')
        $.ajax({
            type: 'POST',
            datatype: 'json',
            data:{
                user_id: id,
                user_status: status
            },
            url: 'https://localhost:3000/superAdmin/changeStatus',
            success: function(result){
                console.log(result.message);
               
            },
            error: function(err){
                console.log(err)
            }
        })
    })
}

function reInvitation() {
    let email = document.getElementById('email').value;
    let name = document.getElementById('name').value;
    let uid = document.getElementById('uid').value;

    $(document).ready(function () {
        $.ajax({
            type: 'post',
            dataType: 'json',
            data: {
                "id": uid,
                "email": email,
                "name": name
            },
            url: 'https://localhost:3000/superAdmin/re-invite',
            success: function (result) {
                console.log(result);
                $('#re-invite').css("display", 'none');
                console.log(`${uid}name`)
                $(`#${uid}name`).text(name);
                $(`#${uid}email`).text(email);
            },
            error: function (err) {
                alert('error called' + err.message);
            }
        })
    })
}

function deleteUser(id){
    var sure = confirm('Are you sure?');
    if(sure){
        $(document).ready(function () {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: `https://localhost:3000/superAdmin/delete-user/${id}`,
                success: function (result) {
                     $('#'+id).remove();
                },
                error: function (err) {
                    alert('error called' + err.message);
                }
            })
        })
    }else return false;

}