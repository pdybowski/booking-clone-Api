const { Hotel } = require('../models/hotel')
const isRoomAvailable = require('../helpers/isRoomAvailable')

const { BadRequestError, NotFoundError } = require('../helpers/apiError')
const { formatDate } = require('../helpers/date')

const DEFAULT_PAGE_SIZE = 50

const isHotelAvailable = async (hotelId, startDate, endDate, adults, children) => {
  const hotel = await Hotel.findOne({ _id: hotelId })

  if(!hotel) {
    throw new NotFoundError('Hotel not found.')
  }

  const rooms = hotel.rooms.filter(r => r.beds.single + r.beds.double * 2 >= parseInt(adults) + parseInt(children))

  if(rooms.length == 0) return false

  let isAvailable = false
  for(r of rooms) {
    isAvailable = await isRoomAvailable(hotelId, r._id, formatDate(startDate, true), endDate)
    if(isAvailable) break 
  }

  return isAvailable
}

exports.getHotels = async (req) => {
  const { city, isFree, adults, children, startDate, endDate } = req.query
  let { pageNumber, pageSize } = req.query

  const hotelsLength = city
    ? await Hotel.countDocuments({ 'localization.city': city })
    : await Hotel.countDocuments()

  pageNumber = pageNumber ? pageNumber : 1
  pageSize = pageSize ? pageSize : DEFAULT_PAGE_SIZE

  const hotels = await Hotel.find(city ? { 'localization.city': city } : null)
    .skip((+pageNumber - 1) * +pageSize)
    .limit(+pageSize)

  if(isFree) {
    if(startDate && endDate && city) {

      const freeHotels = []

      for(let i = 0; i < hotels.length; i++) {
        const isAvailable = await isHotelAvailable(hotels[i]._id, formatDate(startDate, true), formatDate(endDate, true), adults, children)
        if(isAvailable) {
          freeHotels.push({ id: hotels[i]._id, name: hotels[i].name, description: hotels[i].description, clientsRates: hotels[i].clientsRates })
        }
      }

      return { freeHotels, pages: Math.ceil(hotelsLength / pageSize) }
    } else {
      throw new BadRequestError('Provide start date, end date and city.')
    }
  }

  return { hotels, pages: Math.ceil(hotelsLength / pageSize) }
}

exports.getHotel = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId)

  if (!hotel) {
    throw new NotFoundError('Hotel not found')
  }

  return hotel
}

exports.getLimitedHotels = async (limit) => {
  const hotels = await Hotel.find().limit(limit)

  return hotels
}

exports.hotelExists = async (hotelId) => {
  return await Hotel.exists({ _id: hotelId })
}

exports.roomExists = async (hotelId, roomId) => {
  return await Hotel.exists({ _id: hotelId, 'rooms._id': roomId })
}

exports.numberOfGuestsInRoom = async (hotelId, roomId) => {
  const hotel = await Hotel.findOne({ _id: hotelId, 'rooms._id': roomId })

  if (!hotel) {
    return 0
  }

  const room = hotel.rooms.id(roomId)

  return room.beds.single + 2 * room.beds.double
}

exports.getHotelIdsForOwner = async (hotelOwnerId) => {
  return await Hotel.find({ ownerId: hotelOwnerId }).distinct('_id')
}

exports.getHotelOwnerId = async (hotelId) => {
  const hotel = await Hotel.findOne({ _id: hotelId }).select('ownerId -_id')

  if (!hotel) {
    return null
  }

  return hotel.ownerId
}

exports.getAvailableHotelRooms = async (req) => {
  const { id: hotelId } = req.params
  const { adults, children, startDate, endDate } = req.query

  const hotel = await Hotel.findOne({ _id: hotelId })
  
  if(!hotel) {
    throw new NotFoundError('Hotel not found.')
  }

  const rooms = hotel.rooms.filter(r => r.beds.single + r.beds.double * 2 >= parseInt(adults) + parseInt(children))

  const freeRooms = []

  for(r of rooms) {
    if(await isRoomAvailable(hotelId, r._id, formatDate(startDate, true), formatDate(endDate, true))) {
      freeRooms.push(r)
    }
  }

  return freeRooms
}