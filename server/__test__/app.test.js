const request = require('supertest');
const axios = require('axios');
const app = require('../app');

jest.mock('axios');




describe(' /students',()=>{

 afterEach(()=>{
  axios.get.mockReset();
 })
   describe('GET /students',()=>{
    const mockResponse ={
      student:{
        id:1,
        name:"aa",
        cohort:"322",
        instructorid:1
      }
    };
    it('should fetch all student details', async()=>{
         
      axios.get.mockResolvedValue(mockResponse);
      const response = await request(app).get('/api/students')
      const result = await response.body.students;
      expect(result[0]).toEqual(mockResponse.student);
      expect(response.status).toEqual(200);
     
    })
    it('should fetch single student',async () =>{

      axios.get.mockResolvedValue(mockResponse);
      const response = await request(app).get(`/api/students/${1}`)
      const result = await response.body;
      expect(result).toEqual(mockResponse.student);
      expect(response.status).toEqual(200);
     

    })
   it('should create a new student',async () =>{
      const response = await request(app).post('/api/students')
      .send({
        name:"bb",
        cohort:"322",
        instructorid: 1
      })
      console.log(response)
      expect(response.statusCode).toBe(201);
   })
     
   })

  

   
})