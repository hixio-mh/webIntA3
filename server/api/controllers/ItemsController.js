/**
 * ItemsControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const csv = require('csvtojson');

const pathData = './../../somefile';


module.exports = {

  wordOne: async function(req, res) {

    return res.status(200).json(obj);
  },

  wordMore: async function(req, res) {

    return res.status(200).json(obj);
  },

  pageRank: async function(req, res) {


    return res.status(200).send(result);
  }
};





async function getBlogData() {
  return await csv({delimiter: '	'}).fromFile(__dirname + pathData);
}


