function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 === 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
    },
    attackMonster() {
      this.currentRound++;

      const damage = getRandomValue(5, 12);
      this.monsterHealth -= damage;
      this.attackPlayer();

      this.addLogMessage("player", "attack", damage);
    },
    attackPlayer() {
      const damage = getRandomValue(8, 15);
      this.playerHealth -= damage;

      this.addLogMessage("monster", "attack", damage);
    },
    specialAttackMonster() {
      this.currentRound++;

      const damage = getRandomValue(10, 25);
      this.monsterHealth -= damage;
      this.attackPlayer();

      this.addLogMessage("player", "special-attack", damage);
    },
    healPlayer() {
      this.currentRound++;

      const heal = getRandomValue(8, 20);

      if (this.playerHealth + heal > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += heal;
      }

      this.attackPlayer();

      this.addLogMessage("player", "heal", heal);
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
