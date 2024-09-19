export default {
  environment: {
    grass: {
      '0': {
        model: require('../assets/models/environment/grass/model.obj'),
        texture: require('../assets/models/environment/grass/light-grass.png'),
      },
      '1': {
        model: require('../assets/models/environment/grass/model.obj'),
        texture: require('../assets/models/environment/grass/dark-grass.png'),
      },
    },
    road: {
      '0': {
        model: require('../assets/models/environment/road/model.obj'),
        texture: require('../assets/models/environment/road/stripes-texture.png'),
      },
      '1': {
        model: require('../assets/models/environment/road/model.obj'),
        texture: require('../assets/models/environment/road/blank-texture.png'),
      },
    },
    log: {
      '0': {
        model: require('../assets/models/environment/log/0/0.obj'),
        texture: require('../assets/models/environment/log/0/0.png'),
      },
      '1': {
        model: require('../assets/models/environment/log/1/0.obj'),
        texture: require('../assets/models/environment/log/1/0.png'),
      },
      '2': {
        model: require('../assets/models/environment/log/2/0.obj'),
        texture: require('../assets/models/environment/log/2/0.png'),
      },
      '3': {
        model: require('../assets/models/environment/log/3/0.obj'),
        texture: require('../assets/models/environment/log/3/0.png'),
      },
    },
    tree: {
      '0': {
        model: require('../assets/models/environment/tree/0/0.obj'),
        texture: require('../assets/models/environment/tree/0/0.png'),
      },
      '1': {
        model: require('../assets/models/environment/tree/1/0.obj'),
        texture: require('../assets/models/environment/tree/1/0.png'),
      },
      '2': {
        model: require('../assets/models/environment/tree/2/0.obj'),
        texture: require('../assets/models/environment/tree/2/0.png'),
      },
      '3': {
        model: require('../assets/models/environment/tree/3/0.obj'),
        texture: require('../assets/models/environment/tree/3/0.png'),
      },
    },
    lily_pad: {
      model: require('../assets/models/environment/lily_pad/0.obj'),
      texture: require('../assets/models/environment/lily_pad/0.png'),
    },

    river: {
      model: require('../assets/models/environment/river/0.obj'),
      texture: require('../assets/models/environment/river/0.png'),
    },
    railroad: {
      model: require('../assets/models/environment/railroad/0.obj'),
      texture: require('../assets/models/environment/railroad/0.png'),
    },
    train_light: {
      active: {
        '0': {
          model: require('../assets/models/environment/train_light/active/0/0.obj'),
          texture: require('../assets/models/environment/train_light/active/0/0.png'),
        },
        '1': {
          model: require('../assets/models/environment/train_light/active/1/0.obj'),
          texture: require('../assets/models/environment/train_light/active/1/0.png'),
        },
      },
      inactive: {
        model: require('../assets/models/environment/train_light/inactive/0.obj'),
        texture: require('../assets/models/environment/train_light/inactive/0.png'),
      },
    },
    boulder: {
      '0': {
        model: require('../assets/models/environment/boulder/0/0.obj'),
        texture: require('../assets/models/environment/boulder/0/0.png'),
      },
      '1': {
        model: require('../assets/models/environment/boulder/1/0.obj'),
        texture: require('../assets/models/environment/boulder/1/0.png'),
      },
    },
  },
  vehicles: {
    train: {
      front: {
        model: require('../assets/models/vehicles/train/front/0.obj'),
        texture: require('../assets/models/vehicles/train/front/0.png'),
      },
      middle: {
        model: require('../assets/models/vehicles/train/middle/0.obj'),
        texture: require('../assets/models/vehicles/train/middle/0.png'),
      },
      back: {
        model: require('../assets/models/vehicles/train/back/0.obj'),
        texture: require('../assets/models/vehicles/train/back/0.png'),
      },
    },

    police_car: {
      model: require('../assets/models/vehicles/police_car/0.obj'),
      texture: require('../assets/models/vehicles/police_car/0.png'),
    },
    blue_car: {
      model: require('../assets/models/vehicles/blue_car/0.obj'),
      texture: require('../assets/models/vehicles/blue_car/0.png'),
    },
    blue_truck: {
      model: require('../assets/models/vehicles/blue_truck/0.obj'),
      texture: require('../assets/models/vehicles/blue_truck/0.png'),
    },
    green_car: {
      model: require('../assets/models/vehicles/green_car/0.obj'),
      texture: require('../assets/models/vehicles/green_car/0.png'),
    },
    orange_car: {
      model: require('../assets/models/vehicles/orange_car/0.obj'),
      texture: require('../assets/models/vehicles/orange_car/0.png'),
    },
    purple_car: {
      model: require('../assets/models/vehicles/purple_car/0.obj'),
      texture: require('../assets/models/vehicles/purple_car/0.png'),
    },
    red_truck: {
      model: require('../assets/models/vehicles/red_truck/0.obj'),
      texture: require('../assets/models/vehicles/red_truck/0.png'),
    },
    taxi: {
      model: require('../assets/models/vehicles/taxi/0.obj'),
      texture: require('../assets/models/vehicles/taxi/0.png'),
    },
  },
  characters: {
    brent: {
      model: require('../assets/models/characters/brent/0.obj'),
      texture: require('../assets/models/characters/brent/0.png'),
    },
    // chicken: {
    //   model: require('../assets/models/characters/chicken/0.obj'),
    //   texture: require('../assets/models/characters/chicken/0.png'),
    // },
    avocoder: {
      model: require('../assets/models/characters/avocoder/avocoder.obj'),
      texture: require('../assets/models/characters/avocoder/avocoder.png'),
    },
    bacon: {
      model: require('../assets/models/characters/bacon/bacon.obj'),
      texture: require('../assets/models/characters/bacon/bacon.png'),
    },
    wheeler: {
      model: require('../assets/models/characters/wheeler/wheeler.obj'),
      texture: require('../assets/models/characters/wheeler/wheeler.png'),
    },
    palmer: {
      model: require('../assets/models/characters/palmer/palmer.obj'),
      texture: require('../assets/models/characters/palmer/palmer.png'),
    },
    juwan: {
      model: require('../assets/models/characters/juwan/juwan.obj'),
      texture: require('../assets/models/characters/juwan/juwan.png'),
    },
  }
}