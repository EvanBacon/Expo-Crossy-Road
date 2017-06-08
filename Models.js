export default {

  'title': {
    model: require('./assets/models/title/0.obj'),
    texture: require('./assets/models/title/0.png'),
  },
  environment: {
    grass: {
      '0': {
        model: require('./assets/models/environment/grass/0/0.obj'),
        texture: require('./assets/models/environment/grass/0/0.png'),
      },
      '1': {
        model: require('./assets/models/environment/grass/1/0.obj'),
        texture: require('./assets/models/environment/grass/1/0.png'),
      }
    },
    road: {
      '0': {
        model: require('./assets/models/environment/road/0/0.obj'),
        texture: require('./assets/models/environment/road/0/0.png'),
      },
      '1': {
        model: require('./assets/models/environment/road/1/0.obj'),
        texture: require('./assets/models/environment/road/1/0.png'),
      }
    },
    log: {
      '0': {
        model: require('./assets/models/environment/log/0/0.obj'),
        texture: require('./assets/models/environment/log/0/0.png'),
      },
      '1': {
        model: require('./assets/models/environment/log/1/0.obj'),
        texture: require('./assets/models/environment/log/1/0.png'),
      },
      '2': {
        model: require('./assets/models/environment/log/2/0.obj'),
        texture: require('./assets/models/environment/log/2/0.png'),
      },
      '3': {
        model: require('./assets/models/environment/log/3/0.obj'),
        texture: require('./assets/models/environment/log/3/0.png'),
      }
    },
    tree: {
      '0': {
        model: require('./assets/models/environment/tree/0/0.obj'),
        texture: require('./assets/models/environment/tree/0/0.png'),
      },
      '1': {
        model: require('./assets/models/environment/tree/1/0.obj'),
        texture: require('./assets/models/environment/tree/1/0.png'),
      },
      '2': {
        model: require('./assets/models/environment/tree/2/0.obj'),
        texture: require('./assets/models/environment/tree/2/0.png'),
      },
      '3': {
        model: require('./assets/models/environment/tree/3/0.obj'),
        texture: require('./assets/models/environment/tree/3/0.png'),
      }
    },
    lily_pad: {
      model: require('./assets/models/environment/lily_pad/0.obj'),
      texture: require('./assets/models/environment/lily_pad/0.png'),
    },

    river: {
      model: require('./assets/models/environment/river/0.obj'),
      texture: require('./assets/models/environment/river/0.png'),
    },
    railroad: {
      model: require('./assets/models/environment/railroad/0.obj'),
      texture: require('./assets/models/environment/railroad/0.png'),

    },
    train_light: {
      active: {
        '0': {
          model: require('./assets/models/environment/train_light/active/0/0.obj'),
          texture: require('./assets/models/environment/train_light/active/0/0.png'),
        },
        '1': {
          model: require('./assets/models/environment/train_light/active/1/0.obj'),
          texture: require('./assets/models/environment/train_light/active/1/0.png'),
        },
      },
      inactive: {
        model: require('./assets/models/environment/train_light/inactive/0.obj'),
        texture: require('./assets/models/environment/train_light/inactive/0.png'),
      }
    },
    boulder: {
      '0': {
        model: require('./assets/models/environment/boulder/0/0.obj'),
        texture: require('./assets/models/environment/boulder/0/0.png'),
      },
      '1': {
        model: require('./assets/models/environment/boulder/1/0.obj'),
        texture: require('./assets/models/environment/boulder/1/0.png'),
      }
    },

  },
  vehicles: {
    train: {
      front: {
        model: require('./assets/models/vehicles/train/front/0.obj'),
        texture: require('./assets/models/vehicles/train/front/0.png'),

      },
      middle: {
        model: require('./assets/models/vehicles/train/middle/0.obj'),
        texture: require('./assets/models/vehicles/train/middle/0.png'),

      },
      back: {
        model: require('./assets/models/vehicles/train/back/0.obj'),
        texture: require('./assets/models/vehicles/train/back/0.png'),
      }
    },


    police_car: {
      model: require('./assets/models/vehicles/police_car/0.obj'),
      texture: require('./assets/models/vehicles/police_car/0.png'),
    },
    blue_car: {
      model: require('./assets/models/vehicles/blue_car/0.obj'),
      texture: require('./assets/models/vehicles/blue_car/0.png'),
    },
    blue_truck: {
      model: require('./assets/models/vehicles/blue_truck/0.obj'),
      texture: require('./assets/models/vehicles/blue_truck/0.png'),
    },
    green_car: {
      model: require('./assets/models/vehicles/green_car/0.obj'),
      texture: require('./assets/models/vehicles/green_car/0.png'),
    },
    orange_car: {
      model: require('./assets/models/vehicles/orange_car/0.obj'),
      texture: require('./assets/models/vehicles/orange_car/0.png'),
    },
    purple_car: {
      model: require('./assets/models/vehicles/purple_car/0.obj'),
      texture: require('./assets/models/vehicles/purple_car/0.png'),
    },
    red_truck: {
      model: require('./assets/models/vehicles/red_truck/0.obj'),
      texture: require('./assets/models/vehicles/red_truck/0.png'),
    },
    taxi: {
      model: require('./assets/models/vehicles/taxi/0.obj'),
      texture: require('./assets/models/vehicles/taxi/0.png'),
    },
  },


  characters: {
    bacon: {
      model: require('./assets/models/characters/bacon/0.obj'),
      texture: require('./assets/models/characters/bacon/0.png'),
    },
    boss_fish: {
      model: require('./assets/models/characters/boss_fish/0.obj'),
      texture: require('./assets/models/characters/boss_fish/0.png'),
    },
    nikki: {
      model: require('./assets/models/characters/nikki/0.obj'),
      texture: require('./assets/models/characters/nikki/0.png'),
    },
    ide: {
      model: require('./assets/models/characters/ide/0.obj'),
      texture: require('./assets/models/characters/ide/0.png'),
    },
    brent: {
      model: require('./assets/models/characters/brent/0.obj'),
      texture: require('./assets/models/characters/brent/0.png'),
    },

    ducky: {
      model: require('./assets/models/characters/ducky/0.obj'),
      texture: require('./assets/models/characters/ducky/0.png'),
    },
    techno_robot: {
      model: require('./assets/models/characters/techno_robot/0.obj'),
      texture: require('./assets/models/characters/techno_robot/0.png'),
    },
    gangster_pigeon: {
      model: require('./assets/models/characters/gangster_pigeon/0.obj'),
      texture: require('./assets/models/characters/gangster_pigeon/0.png'),
    },
    dazzle_frog: {
      model: require('./assets/models/characters/dazzle_frog/0.obj'),
      texture: require('./assets/models/characters/dazzle_frog/0.png'),
    },

    marilyn_goose: {
      model: require('./assets/models/characters/marilyn_goose/0.obj'),
      texture: require('./assets/models/characters/marilyn_goose/0.png'),
    },

    emo_kid: {
      model: require('./assets/models/characters/emo_kid/0.obj'),
      texture: require('./assets/models/characters/emo_kid/0.png'),
    },
    your_mom: {
      model: require('./assets/models/characters/your_mom/0.obj'),
      texture: require('./assets/models/characters/your_mom/0.png'),
    },
    fan_boy: {
      model: require('./assets/models/characters/fan_boy/0.obj'),
      texture: require('./assets/models/characters/fan_boy/0.png'),
    },
    meme_dog: {
      model: require('./assets/models/characters/meme_dog/0.obj'),
      texture: require('./assets/models/characters/meme_dog/0.png'),
    },

    retro_robot: {
      model: require('./assets/models/characters/retro_robot/0.obj'),
      texture: require('./assets/models/characters/retro_robot/0.png'),
    },
    pew_die_pup: {
      model: require('./assets/models/characters/pew_die_pup/0.obj'),
      texture: require('./assets/models/characters/pew_die_pup/0.png'),
    },
    quackster: {
      model: require('./assets/models/characters/quackster/0.obj'),
      texture: require('./assets/models/characters/quackster/0.png'),
    },
  }
}
