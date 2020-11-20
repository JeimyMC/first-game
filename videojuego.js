function Game(options) {
  this.row = options.row;
  this.colum = options.colum;
  this.coche = options.coche;
  this.enemy = options.enemy;
  this.bala = options.bala;
  this.contador = 0;
  this.intervalId;

  for (rowIndex = 0; rowIndex < options.row; rowIndex++) {
    for (columIndex = 0; columIndex < options.colum; columIndex++) {
      $(".container").append(
        $("<div>")
          .addClass("cell")
          .attr("id", rowIndex + "-" + columIndex)
      );
    }
  }

  $(".container").append($("<div>").attr("id", "game").hide());

  $(".container").append($("<div>").attr("id", "contadorC").hide());

  $(".container").append(
    $("<button>").attr("id", "try").append("try again").hide()
  );

  document.getElementById("juego").style.display = "none";
  this.empezar();
  this.drawCoche();
  this.movimiento();
  this.volver();
}

Game.prototype.empezar = function () {
  const that = this;
  const botonEmpezar = $("<button>")
    .attr("id", "boton")
    .append("start")
    .click(function () {
      $("#introduction").hide();
      $("#juego").show();
      that.drawEnemy(800);
      document.getElementById("audio1").play();
      document.getElementById("audio3").play();
    });
  $("#introduction").append(botonEmpezar);
};

Game.prototype.volver = function () {
  const that = this;
  $("#try").click(function () {
    that.contador = 0;
    $("#contadorC").hide();
    $("#try").hide();
    $("#game").hide();
    that.drawEnemy(800);
    document.getElementById("audio3").play();
  });
};

Game.prototype.drawCoche = function () {
  const selector =
    "[id=" + this.coche.body.row + "-" + this.coche.body.colum + "]";
  const selectorPre =
    "[id=" + this.coche.carMove.row + "-" + this.coche.carMove.colum + "]";
  $(selectorPre).removeClass("coche");
  $(selector).addClass("coche");
  this.choqueEnemigoCoche();
};

Game.prototype.drawEnemy = function (faster) {
  const that = this;
  this.intervalId = setInterval(function () {
    that.enemy.bodyEnemy = that.enemy.bod;
    that.enemy.bod = {
      row: that.moveEnemy(that.enemy.bod.row),
      colum: that.moveEnemy(that.enemy.bod.colum),
    };
    console.log(that.enemy.bod);
    const selectE =
      "[id=" + that.enemy.bod.row + "-" + that.enemy.bod.colum + "]";
    const selectPreE =
      "[id=" +
      that.enemy.bodyEnemy.row +
      "-" +
      that.enemy.bodyEnemy.colum +
      "]";
    $(selectPreE).removeClass("enemy");
    $(selectE).addClass("enemy");

    that.choqueBalaEnemigo();
    that.choqueEnemigoCoche();
  }, faster);
};

Game.prototype.moveEnemy = function (direction) {
  if (Math.abs(direction + movimientoEnemigo()) < 8) {
    return (direction = Math.abs(direction + movimientoEnemigo()));
  } else {
    return (direction = 8);
  }
};

Game.prototype.choqueEnemigoCoche = function () {
  if (
    this.enemy.bod.row === this.coche.body.row &&
    this.enemy.bod.colum === this.coche.body.colum
  ) {
    clearInterval(this.intervalId);

    $(".coche").removeClass("coche");
    $("#game").show();
    $("#contadorC").show().html(this.contador);
    $("#try").show();
    document.getElementById("audio3").pause();
    document.getElementById("audio4").play();
  }
};

Game.prototype.choqueBalaEnemigo = function () {
  if (
    this.enemy.bod.row === this.bala.shoot.row ||
    this.enemy.bod.colum === this.bala.shoot.colum
  ) {
    clearInterval(this.intervalId);
    this.contador++;
    $(".enemy").removeClass("enemy");
    enemyAgain(this.enemy);
    if (this.contador < 5) {
      this.drawEnemy(800);
    } else if (this.contador < 10) {
      this.drawEnemy(700);
    } else {
      this.drawEnemy(600);
    }
  }
};

function Enemy() {
  this.bod = { row: 2, colum: 3 };
  this.intervalId;
}

function movimientoEnemigo() {
  return [-1, 0, 1][Math.floor(Math.random() * 3)];
}

function enemyAgain(enemy) {
  enemy.bod.row = Math.floor(Math.random() * 10);
  enemy.bod.colum = Math.floor(Math.random() * 10);
}

function Car() {
  this.body = { row: 0, colum: 0 };
  this.carMove = this.body;
}

Car.prototype.move = function (y, x) {
  const newPositionY = this.body.row + y;
  const newPositionX = this.body.colum + x;

  if (
    newPositionY > -1 &&
    newPositionX > -1 &&
    newPositionY < 10 &&
    newPositionX < 10
  ) {
    this.body = { row: this.body.row + y, colum: this.body.colum + x };
    $(".shoot").removeClass("shoot");
  }
};

function shootFire() {
  this.shoot = { row: -1, colum: -1 };
}

Game.prototype.goShoot = function (x, y) {
  this.bala.shoot = {
    row: this.coche.body.row + y,
    colum: this.coche.body.colum + x,
  };

  this.selectRL =
    "[id=" + this.bala.shoot.row + "-" + this.bala.shoot.colum + "]";

  $(this.selectRL).addClass("shoot");
};

Game.prototype.movimiento = function () {
  let shootPositivo = 1;
  let shootNegativo = -1;
  $("body").on(
    "keydown",
    function (e) {
      this.coche.carMove = this.coche.body;
      var that = this;
      switch (e.keyCode) {
        case 65:
          shootPositivo = 1;
          shootNegativo = -1;
          this.coche.move(0, -1);
          this.drawCoche();
          break;
        case 68:
          shootPositivo = 1;
          shootNegativo = -1;
          this.coche.move(0, 1);
          this.drawCoche();
          break;
        case 87:
          shootPositivo = 1;
          shootNegativo = -1;
          this.coche.move(-1, 0);
          this.drawCoche();
          break;
        case 83:
          shootPositivo = 1;
          shootNegativo = -1;
          this.coche.move(1, 0);
          this.drawCoche();
          break;
        case 39:
          if (shootPositivo === 4) {
            shootPositivo = 1;
          }
          this.goShoot(shootPositivo++, 0);
          setTimeout(function () {
            $(that.selectRL).removeClass("shoot");
          }, 200);
          document.getElementById("audio2").play();
          break;
        case 37:
          if (shootNegativo === -4) {
            shootNegativo = -1;
          }
          this.goShoot(shootNegativo--, 0);
          setTimeout(function () {
            $(that.selectRL).removeClass("shoot");
          }, 200);
          document.getElementById("audio2").play();
          break;
        case 38:
          if (shootNegativo === -4) {
            shootNegativo = -1;
          }
          this.goShoot(0, shootNegativo--);
          setTimeout(function () {
            $(that.selectRL).removeClass("shoot");
          }, 200);
          document.getElementById("audio2").play();
          break;
        case 40:
          if (shootPositivo === 4) {
            shootPositivo = 1;
          }
          this.goShoot(0, shootPositivo++);
          setTimeout(function () {
            $(that.selectRL).removeClass("shoot");
          }, 200);
          document.getElementById("audio2").play();
          break;
      }
    }.bind(this)
  );
};

$(document).ready(function () {
  const gameOn = new Game({
    row: 10,
    colum: 10,
    coche: new Car(),
    enemy: new Enemy(),
    bala: new shootFire(),
  });
});
