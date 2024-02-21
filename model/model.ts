import { connection } from "../utils/database";
import nodemailer from "nodemailer"



let transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider
  auth: {
    user: "farisahmdali@gmail.com", // Your email
    pass: "kbdkgggbrzwrdxcm", // Your email password or app password
  },
});

class Model {
  private table: string;
  constructor(table: string, specification: string) {
    this.table = table
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${table} (id INT AUTO_INCREMENT PRIMARY KEY ,${specification} ); `
    connection.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating table: ', err);
        return;
      }
      console.log('Table created successfully');
    })
  }

  async getAdmin(username: string) {
    try {
      const results: any = await new Promise<any>((resolve, reject) => {
        connection.query(`SELECT * FROM ${this.table} WHERE username="${username}"`, (err, results, fields) => {
          if (err) {
            console.error('Error fetching data: ', err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      return results;
    } catch (err) {
      console.error('Error in getAdmin: ', err);
      throw err;
    }
  }

  async addNewParkingPlace(name: string, location: string, numberOfFloors: number) {
    try {
      let results: any = await new Promise<any>((resolve, reject) => {
        connection.query(
          'SELECT * FROM ?? WHERE name = ? AND location = ?',
          [this.table, name, location],
          (err, results, fields) => {
            if (err) {
              console.error('Error fetching data: ', err);
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
      console.log(results);
      if (results?.[0]) {
        throw new Error('Parking place already exists');
      }

      await new Promise<void>((resolve, reject) => {
        connection.query(
          'INSERT INTO ?? (name, location, numberOfFloors) VALUES (?, ?, ?)',
          [this.table, name, location, numberOfFloors],
          (err) => {
            if (err) {
              console.error('Error inserting data: ', err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });

      results = await new Promise<any>((resolve, reject) => {
        connection.query(
          'SELECT * FROM ?? WHERE name = ? AND location = ?',
          [this.table, name, location],
          (err, results, fields) => {
            if (err) {
              console.error('Error fetching data: ', err);
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
      console.log(results);
      return results?.[0]?.id;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async addSlots(small: number, medium: number, large: number, xlarge: number, floorNumber: number, placeId: number) {
    try {
      await new Promise<void>((resolve, reject) => {
        connection.query(
          'INSERT INTO ?? (small, medium, large,xlarge,floorNumber,placeId) VALUES (?, ?, ?,?,?,?)',
          [this.table, small, medium, large, xlarge, floorNumber, placeId],
          (err) => {
            if (err) {
              console.error('Error inserting data: ', err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });

    } catch (err) {

    }
  }

  async getPlacesAndName(name?: string, location?: string) {
    try {
      let results: any
      if (name || location) {
        results = await new Promise<any>((resolve, reject) => {
          connection.query(
            `SELECT * FROM ?? WHERE name="${name}" AND location="${location}"`,
            [this.table],
            (err, results, fields) => {
              if (err) {
                console.error('Error fetching data: ', err);
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });
      } else {
        results = await new Promise<any>((resolve, reject) => {
          connection.query(
            'SELECT name,location FROM ?? ',
            [this.table],
            (err, results, fields) => {
              if (err) {
                console.error('Error fetching data: ', err);
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });
      }
      return results
    } catch (err) {
      throw err
    }
  }
  async getAllSlots(id: number) {
    try {
      if (id) {

        const results = await new Promise<any>((resolve, reject) => {
          connection.query(
            `SELECT * FROM ?? WHERE placeId = ?`,
            [this.table, id],
            (err, results, fields) => {
              if (err) {
                console.error('Error fetching data: ', err);
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });
        return results
      }
      return
    } catch (err) {
      throw err
    }
  }

  async bookASlot(data: { number: string | number, driver: string, car: string, placeId: number, floorNumber: number, email: string, slot: string }) {
    try {
      await new Promise<void>((resolve, reject) => {
        connection.query(
          'INSERT INTO ?? (phoneNumber, driver, car,placeId,floor,slot,email) VALUES (?, ?, ?,?,?,?,?)',
          [this.table, data.number, data.driver, data.car, data.placeId, data.floorNumber, data.slot, data.email],
          (err) => {
            if (err) {
              console.error('Error inserting data: ', err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      }).catch((err) => {
        throw new Error("Car Already Added")
      })
    } catch (err) {
      throw err
    }
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      transporter.sendMail({
        to,subject,html
      }, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      });
    } catch (err) {
      throw err
    }
  }

  async getFullData(){
    try{
      const results = await new Promise<any>((resolve, reject) => {
        connection.query(
          `SELECT * FROM ?? `,
          [this.table],
          (err, results, fields) => {
            if (err) {
              console.error('Error fetching data: ', err);
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
      return results
    }catch(err){
      throw err
    }
  }

  async delete(id:number){
    try{
    await new Promise<any>((resolve, reject) => {
        connection.query(
          `DELETE  FROM ?? WHERE id=?`,
          [this.table,id],
          (err, results, fields) => {
            if (err) {
              console.error('Error fetching data: ', err);
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
      return
    }catch(err){
      throw err
    }
  }


}

export default Model