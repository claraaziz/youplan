const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const Plan = require('./plan');


const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

console.log(`started at ${port}`)
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('connected to mongo'))
.catch(err => console.error("couldn't connect:", err))

app.get('/plans', async (req, res) => {
  console.log('GET /plans route hit');
  try{
    const plans = await Plan.find();
    console.log('Plans found:', plans);
    res.json(plans);
  } catch (err) {
      console.error('Error in GET /plans:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
  }
})

app.get('/plans/:_id', async (req, res) => {
  try{
    const plan = await Plan.findById(req.params._id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (err) {
    console.error('Error in GET /plans/:_id', err);
    res.status(500).json({ error: 'Server error', details: err.message})
  }
})

app.post('/plans', async (req,res)=> {
  try{
    const { title, days } = req.body;
    
    if (!days || !title || !Array.isArray(days)) {
      return res.status(400).json({error: 'Missing or invalid data'});
    } 
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
      console.error('Error in POST /plans:', err);
      res.status(400).json({ error: 'Invalid plan data', details: err.message });    
    }
  })

app.put('/plans/:_id', async (req,res)=> {
  try{
    const plan = await Plan.findByIdAndUpdate(req.params._id, {title: req.body.title}, {days: req.body.days}, {new: true});
    res.json(plan);
  }catch(err){
    res.status(500).json({ error: 'Server error' });
  }
})

app.delete('/plans/:_id', async (req,res) => {
  try{
    const {_id} = await Plan.findByIdAndDelete(req.params._id);
  } catch(err) {
    console.error('Error in DELETE /plans/:_id:', err);
        res.status(500).json({ error: 'Server error', details: err.message });    }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

