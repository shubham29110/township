var Buildings = require('../models/building')

/**
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.get_method_BuildingDetail=async function(req,res){
    try {
        
        let building = await Buildings.findOne({ owner_id: req._passport.session.user })
        if (building) {
            res.render('building', { building: building })
        } else {
            res.render('building')
        }
        
    } catch (error) {
        console.log(error)
        res.send(error)
        }

}


/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.post_method_BuildingDetail = async function (req, res) {
   
        try {
            let buildingName = req.body.bname
            let buildingAddress = req.body.baddress
            let NoOfFloors = req.body.bfloornumber

            let newBuilding = new Buildings({
                name: buildingName,
                address: buildingAddress,
                floors: NoOfFloors,
                owner_id: req._passport.session.user
            })
            var building = await newBuilding.save()
            if (building) {
                req.flash('success_msg', 'Buidling Details has been added successfully!')
                res.redirect('/')
            }
        } catch (err) {
            res.send(err.message);
        }
    }


/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.editBuilding = async function (req, res) {
    try {
        let buildingName = req.body.bname
        let buildingAddress = req.body.baddress
        let NoOfFloors = req.body.bfloornumber
        let buildingId = req.params.id

        let newBuilding = {
            name: buildingName,
            address: buildingAddress,
            floors: NoOfFloors,
        }
        var building = await Buildings.findByIdAndUpdate(buildingId, newBuilding);
        if (building) {
            req.flash('success_msg', 'Buidling Details has been updated successfully!')
            res.redirect('/')
        }
    } catch (err) {
        res.send(err.message);
    }
}