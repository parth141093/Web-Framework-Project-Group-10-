const emailTypeEnum = {
    DELETE: 0,
    UPDATE: 1,
    ADD: 2
}
const sendEmail = async (emailType, emailAddress, oldDetails, updatedDetails = null) => {

    let subjectText;
    if(emailTypeEnum.UPDATE) {
        subjectText = "Edited Food"
    } else if(emailTypeEnum.DELETE) {
        subjectText = "Deleted Food"
    } else if(emailTypeEnum.ADD) {
        subjectText = "Added Food"
    }
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'parthpatel1410@gmail.com',
          pass: 'qxrd jkwt ayym nxwl',
        },
      });
    await transporter.sendMail({
        from: 'parthpatel1410@gmail.com',
        to: `${emailAddress}`,
        bcc: `ejhcanme@mailosaur.net`,
        subject: subjectText, // Subject line
        html: body(emailType, oldDetails, updatedDetails)
      });

}

function body(emailType, oldDetails, updatedDetails) {
    switch(emailType) {
        case emailTypeEnum.UPDATE:
            return `
            <b>Your Food is Edited</b><br/><br/>
            <b>Old food details:<b><br/>
            <p>Name: ${oldDetails.name}<p>
            <p>description: ${oldDetails.description}<p>
            <p>ingredients: ${oldDetails.ingredients}<p>
            <p>how_to_make: ${oldDetails.how_to_make}<p>
            <p>type_of_food: ${oldDetails.type_of_food}<p>
            <p>nationality: ${oldDetails.nationality}<p>
            <p>mealType: ${oldDetails.mealType}<p><br/>
            <b>Updated food details:<b><br/>
            <p>Name: ${updatedDetails.name}<p>
            <p>description: ${updatedDetails.description}<p>
            <p>ingredients: ${updatedDetails.ingredients}<p>
            <p>how_to_make: ${updatedDetails.how_to_make}<p>
            <p>type_of_food: ${updatedDetails.type_of_food}<p>
            <p>nationality: ${updatedDetails.nationality}<p>
            <p>mealType: ${updatedDetails.mealType}<p>
            `; // html body
        case emailTypeEnum.DELETE:
            return `
            <b>Your Food is deleted</b><br/><br/>
            <p>Name: ${oldDetails.name}<p>
            <p>description: ${oldDetails.description}<p>
            <p>ingredients: ${oldDetails.ingredients}<p>
            <p>how_to_make: ${oldDetails.how_to_make}<p>
            <p>type_of_food: ${oldDetails.type_of_food}<p>
            <p>nationality: ${oldDetails.nationality}<p>
            <p>mealType: ${oldDetails.mealType}<p><br/>
            `;
        default: return ``;
    }
}
module.exports = {
    emailTypeEnum,
    sendEmail
};