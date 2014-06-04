var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , empData = require( '../data/employee.json' );

var ContactSchema= new Schema({
    //id: {type: Integer, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    managerId: {type: Number },
    title: {type: String },
    department: {type: String },
    officePhone: { type: String },
    cellPhone: { type: String },
    email: { type: String },
    city: { type: String },
    address: { type: String },
    picture: { type: String },
    // facebookId: { type: String },
    twitterId: { type: String },
    blogURL: { type: String },
    tags: { type: String },
    uwagi: { type: String }
});

var ContactModel = mongoose.model('Contact', ContactSchema);
mongoose.connect('mongodb://192.168.73.30/contacts');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    // yay!
    ContactModel.count(function (err, count) {
        if (count == 0) {
            console.log("The contacts collection does not exist. Creating it with sample data...");
            //populateDB();
            for( var i = 0; i < empData.length; i++ ) {
                new ContactModel( empData[ i ] ).save();
            };
        }
    });
});

exports.contacts = function (req, res) {
    return ContactModel.find(function (err, contacts) {
        if (!err) {
            res.json(contacts);
        } else {
            console.log(err);
        }
    });
};

exports.contact = function(req, res) {
    var id = req.params.id;
    if (id) {
        ContactModel.findById(id, function (err, contact) {
            if (!err) {
                if (contact) {
                    res.json({contact: contact, status: true});
                } else {
                    res.json({ status: false });
                }
            } else {
                console.log(err);
            }
        });
    }
};

exports.add = function(req, res) {
    var contact = req.body;
    console.log('Zapisuje ', req.body.firstName, req.body.lastName, 'Tagi: ', req.body.tags);
    contact = new ContactModel({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        department: req.body.department,
        cellPhone: req.body.cellPhone,
        officePhone: req.body.officePhone,
        email: req.body.email,
        //facebook: req.body.facebook,
        twitterId: req.body.twitterId,
        tags: req.body.tags
        //skype: req.body.skype
    });
    contact.save(function (err) {
        if (!err) {
            res.json(true);
        } else {
            console.log(err);
            res.json(false);
        }
    });
    return res.jsonp(req.body);
};

exports.edit = function (req, res) {
    var id = req.params.id;
    //console.log('Znaleziono id. ', id, 'Tagi: ', req.body.tags);
    if (id) {
        ContactModel.findById(id, function (err, contact) {
            contact.lastName = req.body.lastName,
            contact.firstName = req.body.firstName,
            contact.department = req.body.department,
            contact.cellPhone = req.body.cellPhone,
            contact.officePhone = req.body.officePhone,
            contact.email = req.body.email,
            //contact.facebook = req.body.facebook,
            contact.twitterId = req.body.twitterId,
            contact.tags = req.body.tags
            contact.save(function (err) {
                if (!err) {
                    res.json(true);
                } else {
                    res.json(false);
                    console.log(err, 'Id. ' + id);
                }
            });
        });
    }
};

exports.delete = function (req, res) {
    var id = req.params.id;
    if (id) {
        ContactModel.findById(id, function (err, contact) {
            contact.remove(function (err) {
                if (!err) {
                    res.json(true);
                } else {
                    res.json(false)
                    console.log(err);
                }
            });
        });
    }
};
