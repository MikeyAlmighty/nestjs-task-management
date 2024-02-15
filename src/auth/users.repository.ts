import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UsersRepository extends Repository<User>{
  private logger = new Logger('UsersRepository', { timestamp: true})
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>{
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt)

   const user = this.create({
     username,
     password: hashedPassword
   });

   try {
     await this.save(user);
   } catch (error){
     if (error.code === '23505') { // duplicate username
       this.logger.error(`User "${user.username}" already exists`, error)
       throw new ConflictException('Username already exists');
     } else {
       this.logger.error(`There was an error creating User "${user.username}"`, error)
       throw new InternalServerErrorException()  ;
     }
   }
  }
}