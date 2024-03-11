import { registerAs } from '@nestjs/config'

export default registerAs('mfiles', () => ({
  username: process.env.MFILES_USERNAME,
  password: process.env.MFILES_PASSWORD,
  vaultGuid: process.env.MFILES_VAULT_GUID,
}))
