import jwt from "jsonwebtoken"
import Model from "../model/model"
import bcrypt from "bcrypt"

const adminUsers = new Model("admins", "username VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL")
const parking = new Model("parkingPlaces","name VARCHAR(255) NOT NULL,location VARCHAR(255) NOT NULL,numberOfFloors INT NOT NULL")
const slots = new Model("slots","xlarge INT,large INT,medium INT,small INT,floorNumber INT NOT NULL,placeId INT, FOREIGN KEY (placeId) REFERENCES parkingPlaces(id)")
const booking = new Model("bookings", "driver VARCHAR(255) NOT NULL,phoneNumber VARCHAR(13) NOT NULL,car VARCHAR(15) NOT NULL UNIQUE,email VARCHAR(255) NOT NULL,floor INT NOT NULL,slot VARCHAR(255) NOT NULL UNIQUE,placeId INT, FOREIGN KEY (placeId) REFERENCES parkingPlaces(id)")

class adminHandler {
    async login(username: string, password: string) {
        try {
            const result: any = await adminUsers.getAdmin(username)
            const validate = bcrypt.compareSync(password, result[0]?.password)
            let token:string
            if (validate) {
                token = jwt.sign({ id: result[0]?.id }, process.env.TOKEN + "")
                return token
            } else {
                throw new Error("Username or Password is incorrect")
            }
        } catch (err) {
            throw err
        }
    }
    async onboarding(data: any){
        try{
            const {numberOfFloors,name,location,floorDetails} = data
            console.log({numberOfFloors,name,location,floorDetails} );
            const placeId =await parking.addNewParkingPlace(name,location,parseInt(numberOfFloors));
            floorDetails.map((x:any,i:number)=>{
                slots.addSlots(parseInt(x?.small),parseInt(x?.medium),parseInt(x?.large),parseInt(x?.xlarge),i+1,placeId)
            })
            return
        }catch(err){
            throw err
        }
    }
    async getBookings(){
        try{
          const result = await  booking.getFullData()
          return result
        }catch(err){
            throw err
        }
    }
    async reached(id:number){
        try{
             await  booking.delete(id)
            return 
          }catch(err){
              throw err
          }
    }
}

export default adminHandler