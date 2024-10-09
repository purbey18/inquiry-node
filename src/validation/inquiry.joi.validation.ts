import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const addInquiry = {
    body: Joi.object({
        partyName: Joi.string().label('Party name').trim().required(),
        companyName: Joi.string().label('Company name').trim().allow(""),
        contactNumber: Joi.number().label('Contact number').required(),
        email: Joi.string().email().trim().lowercase().allow(""),
        address: Joi.string().trim().allow(""),
        pinCode: Joi.number().allow(""),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().allow(""),
        country: Joi.string().trim().allow(""),
        date: Joi.string().label('Date').required(),
        source: Joi.string().allow(""),
        person: Joi.objectId(),
        requirements: Joi.array().items({
            requirementId: Joi.objectId().required(),
            units: Joi.string().required()
        }),
        remark: Joi.string().allow(""),
        status: Joi.string()
    }),
}

export const updateInquiryDetails = {
    body: Joi.object().keys({
        id: Joi.objectId().required(),
        partyName: Joi.string().label('Party name').trim().required(),
        companyName: Joi.string().label('Company name').trim().allow(""),
        contactNumber: Joi.number().label('Contact number').required(),
        email: Joi.string().email().trim().lowercase().allow(""),
        address: Joi.string().trim().allow(""),
        pinCode: Joi.number().allow(""),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().allow(""),
        country: Joi.string().trim().allow(""),
        date: Joi.string().label('Date').required(),
        source: Joi.string().allow(""),
        person: Joi.objectId(),
        requirements: Joi.array().items({
            requirementId: Joi.objectId().required(),
            units: Joi.string().required()
        }),
        remark: Joi.string().allow(""),
    })
}

export const deleteInquiry = {
    body: Joi.object().keys({
        id: Joi.objectId().required(),
    })
}

export const inquiryDetails = {
    body: Joi.object().keys({
        id: Joi.objectId().required(),
    })
}

export const changeInquiryStatus = {
    body: Joi.object().keys({
        id: Joi.objectId().required(),
        inquiryStatus: Joi.object().keys({
            stepStatus: Joi.string().valid("contacted", "working", "won", "lost").required(),
            remark: Joi.string().allow("")
        })
    })
}

export const updateRemark = {
    body: Joi.object().keys({
        id: Joi.objectId().required(),
        stepStatus: Joi.string().valid("contacted", "working", "won", "lost").required(),
        remark: Joi.string().required().allow(""),
        status: Joi.number().valid(0)
    })
}

export const changeStatus = {
    body: Joi.object().keys({
        id: Joi.objectId().required(),
        status: Joi.number().label('Status').required().min(0).max(1)
    })
}

export const discountOnRequirement = {
    body: Joi.object().keys({
        id: Joi.objectId().required(),
        discountOnrequirement: Joi.array().required(),
        userComment: Joi.string().required()
    })
}

export const addProductionUserComment = {
    body: Joi.object().keys({
        id: Joi.objectId().required(),
        productionUserComment: Joi.string().required()
    })
}