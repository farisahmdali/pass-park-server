import Model from "../model/model"

const parking = new Model("parkingPlaces", "name VARCHAR(255) NOT NULL,location VARCHAR(255) NOT NULL,numberOfFloors INT NOT NULL")
const slots = new Model("slots", "xlarge INT,large INT,medium INT,small INT,floorNumber INT NOT NULL,placeId INT, FOREIGN KEY (placeId) REFERENCES parkingPlaces(id)")
const booking = new Model("bookings", "driver VARCHAR(255) NOT NULL,phoneNumber VARCHAR(13) NOT NULL,car VARCHAR(15) NOT NULL UNIQUE,email VARCHAR(255) NOT NULL,floor INT NOT NULL,slot VARCHAR(255) NOT NULL UNIQUE,placeId INT, FOREIGN KEY (placeId) REFERENCES parkingPlaces(id)")
class UserHandler {
  async getDropDowns() {
    try {
      const res = await parking.getPlacesAndName()
      const data: { locations: string[] } = { locations: [] }
      res.map((x: any) => {
        data.locations.push(x?.name + " - " + x?.location)
      })
      console.log(data)
      return data
    } catch (err) {
      throw err
    }
  }

  async slotsAvailable(area: string) {
    try {

      const [name, location] = area.split(" - ")
      console.log(name, location)
      // if(!name || !location)throw new Error('Invalid Area')
      interface Slot {
        floorNumber: number;
        small: number;
        medium: number;
        large: number;
        xlarge: number;
      }
      const data = await parking.getPlacesAndName(name, location);
      const placeId = data[0].id
      async function processSlots(name: string, data: Slot[], bookedSlots: string[]) {
        const totalTokens: any[] = [];
        if (data?.[0]) {

          for (const slot of data) {
            const floorNumber = slot.floorNumber;
            let tokens: any[] = [];

            const checkAndPushToken = (type: string, count: number) => {
              for (let j = 0; j < count; j++) {
                const slotName = `${name}-${type}-${String.fromCharCode(64 + floorNumber)}-${j + 1}`;
                if (!bookedSlots.includes(slotName)) {
                  tokens.push(slotName);
                }
              }
            };

            checkAndPushToken('small', slot.small);
            totalTokens.push({ floorNumber, totalSlots: slot.small, tokens, type: 'small' ,placeId});
            tokens = []
            checkAndPushToken('medium', slot.medium);
            totalTokens.push({ floorNumber, totalSlots: slot.medium, tokens, type: 'medium',placeId });
            tokens = []
            checkAndPushToken('large', slot.large);
            totalTokens.push({ floorNumber, totalSlots: slot.large, tokens, type: 'large',placeId });
            tokens = []
            checkAndPushToken('xlarge', slot.xlarge);
            totalTokens.push({ floorNumber, totalSlots: slot.xlarge, tokens, type: 'xlarge',placeId });
          }

        }
        return totalTokens;
      }

      // Usage
      const totalSlots = await slots.getAllSlots(data[0].id);
      let bookedSlots = await booking.getAllSlots(data[0].id);
      console.log(totalSlots?.[0]?.small, "\n", bookedSlots);

      bookedSlots = bookedSlots?.map((x: any) => x?.slot);

      const totalTokens = await processSlots(name, totalSlots, bookedSlots);
      return totalTokens

    } catch (err) {
      throw err
    }
  }

  async bookSlot(data:{number:string|number,driver:string,car:string,placeId:number,floorNumber:number,email:string,slot:string}){
   try{
    await booking.bookASlot(data)
    booking.sendMail(data.email,"Your Slot Succesfully Booked",`<h1>Your Token Number Is <span style="color:red">${data.slot}</span></h1>`)
   }catch(err){
    throw err
   }
  }
}


export default UserHandler