const Ticket = require('../models/ticket');
const Building = require('../models/building');
const User = require('../models/user');
const defaultJson = require('../util/default.json');

module.exports.get_addTicket = function(req,res){
    try {
        let currentUser = req._passport.session.user ;
        res.render('ticket', { heading: "Create new Ticket", userId: currentUser });
    } catch (error) {
        console.log(error);
        throw error
    }
       
    
}

module.exports.post_addTicket = async function (req, res) {
        try {
            let user = await User.findById(req._passport.session.user);
            if (user) {
                let date = new Date();
                console.log(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
                let building = await Building.findOne({ owner_id: user.createdby })
                console.log("building - ", building)
                let newTicket = new Ticket({
                    title: req.body.ticket_title,
                    description: req.body.ticket_description,
                    floor: req.body.ticket_floor,
                    createdby: req._passport.session.user,
                    creation_date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
                    building_id: building.id,
                    building_owner: building.owner_id,
                    status: defaultJson.ticket_status.OPEN
                })
                let ticket = await newTicket.save();
                if (ticket) {
                    req.flash('success_msg', 'Ticket is raised successfully.');
                    res.redirect('/');
                } else {
                    req.flash('error_msg', 'Something went wrong.');
                    res.redirect('/');
                }

            }

        } catch (err) {
            console.log(err);
            throw err;
        }
    }



/**
 * changes status of the ticket
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.changeTicketStatus = async function (req, res) {
    try {
        let ticket = await Ticket.findByIdAndUpdate(req.body.id, { status: req.body.status });
        if (ticket) {
            res.json({ 'message': 'updated', status: req.body.status });
        }
    } catch (err) {
        res.json({ "message": err });
    }

}

/**
 * show edit ticket form
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.showEditTicket = async function(req, res){
    try{
        let ticket = await Ticket.findById(req.params.ticketId);
        if(ticket){
            res.render('ticket', {ticket: ticket});
        }else{
            req.flash('error_msg', 'Issue not found.');
        }
    }catch(err){
        res.send(err.message);
    }
}

/**
 * edit ticket 
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.editTicket = async function (req, res) {
    try {
        console.log("ticket status ",req.body.ticket_status);
        let date = new Date();
        let ticket = await Ticket.findByIdAndUpdate(req.body.ticket_id, {
            title: req.body.ticket_title,
            description: req.body.ticket_description,
            floor: req.body.ticket_floor,
            status: req.body.ticket_status,
            update_date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
        })
        if (ticket) {
            req.flash('success_msg', 'Ticket is updated successfully.');
            res.redirect('/');
        } else {
            req.flash('error_msg', 'Something went wrong.');
            res.redirect('/');
        }

    } catch (err) {
        res.send(err.message)
    }
}

/**
 * delete ticket
 * @param {Object} req 
 * @param {Object} res 
 */
module.exports.deleteTicket = async function(req, res){
    try{
        let ticket = await Ticket.findByIdAndRemove(req.params.ticketId);
        if(ticket){
            req.flash('success_msg', 'Issue has been removed successfully.');
            res.redirect('/');
        }else{
            req.flash('error_msg', 'Issue not found.');
            res.redirect('/');
        }
    }catch(err){
        res.send(err.message);
    }
}