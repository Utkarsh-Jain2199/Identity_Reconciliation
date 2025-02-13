const Contact = require("../models/Contact");

/**
 * @swagger
 * /identify:
 *   post:
 *     summary: Identify or create a contact based on email or phoneNumber.
 *     description: Returns a consolidated contact, linking it to an existing one if applicable.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "lorraine@hillvalley.edu"
 *               phoneNumber:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Successfully returns consolidated contact information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contact:
 *                   type: object
 *                   properties:
 *                     primaryContactId:
 *                       type: number
 *                       example: 1
 *                     emails:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"]
 *                     phoneNumbers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["123456"]
 *                     secondaryContactIds:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [23]
 *       400:
 *         description: Bad request. Email or phoneNumber must be provided.
 *       500:
 *         description: Internal server error.
 */
exports.identifyContact = async (req, res) => {
  try {
    let { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ error: "At least one of email or phoneNumber must be provided" });
    }

    if (phoneNumber) {
      phoneNumber = phoneNumber.toString();
    }

    const query = { deletedAt: null, $or: [] };
    if (email) query.$or.push({ email });
    if (phoneNumber) query.$or.push({ phoneNumber });

    let foundContacts = await Contact.find(query);

    if (foundContacts.length === 0) {
      const newContact = new Contact({
        email: email,
        phoneNumber: phoneNumber,
        linkedId: null,
        linkPrecedence: "primary",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      await newContact.save();

      return res.status(200).json({
        contact: {
          primaryContactId: newContact.id,
          emails: [newContact.email],
          phoneNumbers: [newContact.phoneNumber],
          secondaryContactIds: [],
        },
      });
    }

    let primaryContact = foundContacts.find(c => c.linkPrecedence === "primary");

    if (!primaryContact) {
      const firstContact = foundContacts[0];
      primaryContact = (await Contact.findOne({ id: firstContact.linkedId })) || firstContact;
    }

    let linkedContacts = await Contact.find({
      deletedAt: null,
      $or: [{ id: primaryContact.id }, { linkedId: primaryContact.id }],
    });

    const emailsSet = new Set();
    const phoneNumbersSet = new Set();
    const secondaryContactIds = [];

    linkedContacts.forEach(contact => {
      if (contact.email) emailsSet.add(contact.email);
      if (contact.phoneNumber) phoneNumbersSet.add(contact.phoneNumber);
      if (contact.linkPrecedence === "secondary") {
        secondaryContactIds.push(contact.id);
      }
    });

    let newRecordNeeded = false;
    if (email && phoneNumber) {
      if (!emailsSet.has(email) || !phoneNumbersSet.has(phoneNumber)) {
        newRecordNeeded = true;
      }
    }

    if (newRecordNeeded) {
      const newSecondary = new Contact({
        email: email || null,
        phoneNumber: phoneNumber || null,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      await newSecondary.save();

      if (newSecondary.email) emailsSet.add(newSecondary.email);
      if (newSecondary.phoneNumber) phoneNumbersSet.add(newSecondary.phoneNumber);
      secondaryContactIds.push(newSecondary.id);
      linkedContacts.push(newSecondary);
    }

    const emailsArr = email ? [email] : [];
    emailsSet.forEach(e => { if (e !== email) emailsArr.push(e); });

    const phoneNumbersArr = phoneNumber ? [phoneNumber] : [];
    phoneNumbersSet.forEach(p => { if (p !== phoneNumber) phoneNumbersArr.push(p); });

    return res.status(200).json({
      contact: {
        primaryContactId: primaryContact.id,
        emails: emailsArr,
        phoneNumbers: phoneNumbersArr,
        secondaryContactIds,
      },
    });

  } catch (error) {
    console.error("Error in /identify endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
