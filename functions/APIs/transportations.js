const { db } = require('../util/admin');

exports.getAllTransportations = (request, response) => {
	db
		.collection('transportations')
        .where('username', '==', request.user.username)
		.orderBy('year', 'desc')
		.get()
		.then((data) => {
			let transportations = [];
			data.forEach((doc) => {
				transportations.push({
                    transportationId: doc.id,
                    color: doc.data().color,
					type: doc.data().type,
					year: doc.data().year,
				});
			});
			return response.json(transportations);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.postOneTransportation = (request, response) => {
	if (request.body.color.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(request.body.type.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }

    if(request.body.year.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    
    const newTransportation = {
        color: request.body.color,
        type: request.body.type,
        year: request.body.year,
        username: request.user.username
    }
    db
        .collection('transportations')
        .add(newTransportation)
        .then((doc)=>{
            const responseTransportationInput = newTransportation;
            responseTransportationInput.id = doc.id;
            return response.json(responseTransportationInput);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

exports.deleteTransportation = (request, response) => {
    const document = db.doc(`/transportation/${request.params.transportationId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Transportation not found' })
            }
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"UnAuthorized"})
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editTransportations = ( request, response ) => { 
    if(request.body.transportationId){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('transportations').doc(`${request.params.transportationId}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};