const router = require('express').Router()
const ticketController = require('../controller/ticket')
const middleware = require('../middleware/index')

//create
router.get('/', middleware.ensureAuthenticated, ticketController.get_addTicket)
router.post('/', middleware.ensureAuthenticated, ticketController.post_addTicket)

//edit
router.get('/:ticketId',middleware.ensureAuthenticated, ticketController.showEditTicket)
router.post('/edit-ticket',middleware.ensureAuthenticated, ticketController.editTicket)

//delete
router.get('/:ticketId', middleware.ensureAuthenticated, ticketController.deleteTicket)

router.post('/ticket-status', ticketController.changeTicketStatus);

module.exports = router;