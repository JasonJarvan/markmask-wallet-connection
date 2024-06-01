import { SiweMessage } from 'siwe'

export default async function handler(req, res) {
  const { message, signature } = req.body

  try {
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)

    res.status(200).json({ success: true, fields })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
}