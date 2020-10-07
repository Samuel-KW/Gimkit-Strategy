// Desmos
let calculator = Desmos.GraphingCalculator(document.getElementById('calculator'));
calculator.setState({"version":7,"graph":{"viewport":{"xmin":-10,"ymin":-10,"xmax":10,"ymax":10},"xAxisMinorSubdivisions":1,"yAxisMinorSubdivisions":1,"xAxisLabel":"Questions Answered","yAxisLabel":"Money"},"randomSeed":"149815cec039f630f10f6165b8450b68","expressions":{"list":[{"type":"expression","id":"1","color":"#c74440"}]}});

// Log Desmos dispatch events
if (false) {
    let x = calculator.controller.dispatch;
    calculator.controller.dispatch = function () {

        if (arguments[0].type != 'tick')console.log(arguments);
        x.apply(this, arguments);

    }
}

class Player {
    constructor () {
        this.upgrades = {
            mpq: [{"price":0,"value":1},{"price":10,"value":5},{"price":100,"value":50},{"price":1000,"value":100},{"price":10000,"value":500},{"price":75000,"value":2000},{"price":300000,"value":5000},{"price":1000000,"value":10000},{"price":10000000,"value":250000},{"price":100000000,"value":1000000}],
            multi: [{"price":0,"value":1},{"price":50,"value":1.5},{"price":300,"value":2},{"price":2000,"value":3},{"price":12000,"value":5},{"price":85000,"value":8},{"price":700000,"value":12},{"price":6500000,"value":18},{"price":65000000,"value":30},{"price":1000000000,"value":100}],
            streak: [{"price":0,"value":1},{"price":20,"value":3},{"price":200,"value":10},{"price":2000,"value":50},{"price":20000,"value":250},{"price":200000,"value":1200},{"price":2000000,"value":6500},{"price":20000000,"value":35000},{"price":200000000,"value":175000},{"price":2000000000,"value":1000000}]
        };

        this.powerups = {
            rebuy: { "baseCost": 1000, "percentageCost": 0.3,  "value": 0 },
            mini:  { "baseCost": 20,   "percentageCost": 0.03, "value": 0 },
            mega:  { "baseCost": 50,   "percentageCost": 0.06, "value": 0 }
        };

        // Current upgrades
        this.current = {
            mpq: 0,
            multi: 0,
            streak: 0
        };

        // Powerups
        this.active = {
            rebuy: false,
            mini: false,
            mega: false
        };

        this.strategy = [
            { type: 'upgrade', when: 15, upgrade: 'streak', level: 1 },
            { type: 'upgrade', when: 50, upgrade: 'mpq', level: 2 },
            { type: 'powerup', when: 55, type: 'mega' },
            { type: 'upgrade', when: 150, upgrade: 'streak', level: 2 },
            { type: 'upgrade', when: 300, upgrade: 'multi', level: 2 },
            { type: 'upgrade', when: 10000, upgrade: 'mpq', level: 1 },
            { type: 'upgrade', when: 10000, upgrade: 'mpq', level: 1 },
            { type: 'upgrade', when: 10000, upgrade: 'mpq', level: 1 },
            { type: 'upgrade', when: 10000, upgrade: 'mpq', level: 1 },
            { type: 'upgrade', when: 10000, upgrade: 'mpq', level: 1 },
            { type: 'upgrade', when: 10000, upgrade: 'mpq', level: 1 },




            { type: 'powerup', when: 10001, type: 'mini' },
            { type: 'use', when: 10002, type: 'mini' }
        ];

        this.streak = 0;
        this.money = 0;
        this.index = 0;

        this.money_data = [];
        this.visualize_upgrades = true;
        this.visualize_powerups = true;
    }

    // Run simulation
    run (starting_money, goal) {
        this.current = {
            mpq: 0,
            multi: 0,
            streak: 0
        };
        
        this.money = starting_money;
        this.streak = 0;
        this.index = 0;
        
        this.money_data = [];
    
        // Keep answering questions until the goal is reached
        while (this.money < goal) {
    
            // Answer a question
            this.answer_question();

            // If goal has not been reached, attempt to purchase an upgrade
            this.purchase_upgrade('mpq', 2) ||
                this.purchase_upgrade('streak', 2) ||
                this.purchase_upgrade('multi', 2) ||
                this.purchase_upgrade('mpq', 3) ||
                this.purchase_upgrade('streak', 3) ||
                this.purchase_upgrade('multi', 3) ||
                this.purchase_upgrade('mpq', 4) ||
                this.purchase_upgrade('streak', 4) ||
                this.purchase_upgrade('multi', 4) ||
                this.purchase_upgrade('mpq', 5) ||
                this.purchase_upgrade('multi', 5) ||
                this.purchase_upgrade('streak', 5) ||
                this.purchase_upgrade('mpq', 6) ||
                this.purchase_upgrade('multi', 6) ||
                this.purchase_upgrade('streak', 6) ||
                this.purchase_upgrade('mpq', 7) ||
                this.purchase_upgrade('multi', 7) ||
                this.purchase_upgrade('mpq', 8) ||
                this.purchase_upgrade('streak', 7) ||
                this.purchase_upgrade('multi', 8) ||
                this.purchase_upgrade('mpq', 9) ||
                this.purchase_upgrade('streak', 8) ||
                this.purchase_upgrade('multi', 9) ||
                this.purchase_upgrade('mpq', 10) ||
                this.purchase_upgrade('streak', 9) ||
                this.purchase_upgrade('multi', 10) ||
                this.purchase_upgrade('streak', 10);
        }
    
        // Visualize the data
        this.visualize();

        // Log results
        console.log('It took', this.index, 'iterations to reach', this.money); 
    }

    // Purchase upgrade of given level
    purchase_upgrade (upgrade, level) {
        level--;

        let data = this.upgrades[upgrade],
            goal = data[level];

        // Make sure user has enough money
        if (goal.price <= this.money && this.current[upgrade] < level) {

            // Add purchase to graph
            if (this.visualize_upgrades) calculator.setExpression({ latex: `(${this.index - 1},${this.money})`, label: upgrade + level, showLabel: true, labelSize: 'small', color: '#e800ba' });

            // Reset streak
            this.streak = 0;

            // Subtract cost of upgrade
            this.money -= goal.price;

            // Set current upgrade to level
            this.current[upgrade] = level;

            return true;
        }
        return false;
    }

    // Purchase powerup
    purchase_powerup (type) {
        let powerup = this.powerups[type],
            cost = powerup.baseCost + (this.money * powerup.percentageCost);

        if (powerup.value === 0 && this.money >= cost) {
            
            // Subtract cost of powerup
            this.money -= cost;

            // Set purchased to true
            powerup.value = 1;
            
            return true;
        }

        return false;
    }

    // Use powerup
    use_powerup (type) {
        let powerup = this.powerups[type];

        // If powerup is purchased
        if (powerup.value === 1) {
            
            // Set active to true if type is not rebuy
            this.active[type] = type !== 'rebuy';
        
            // Visualize the powerup
            if (this.visualize_powerups) calculator.setExpression({ latex: `(${this.index - 1},${this.money})`, label: type, showLabel: true, labelSize: 'small', color: '#03fcc2' });
        
            // Custom powerup abilities
            if (type === 'rebuy') {

                // Set all powerups to purchased
                for (let i in this.powerups)
                    this.powerups[i].value = 1;
            }

            // Set powerup to used
            powerup.value = -1;

            return true;
        }

        return false;
    }

    // Answer a question
    answer_question () {

        // Current upgrades
        let mpq = this.upgrades.mpq[this.current.mpq].value,
            sb = this.upgrades.streak[this.current.streak].value,
            multi = this.upgrades.multi[this.current.multi].value;

        // Update money
        this.money += (mpq + (this.streak * sb)) * multi;

        // Update streak
        if (this.streak < 99) this.streak++;

        // Update money data
        this.money_data.push(this.money);

        // Update index
        this.index++;
    }

    // Visualize data
    visualize () {
        let x = [],
            y = [];

        this.money_data.forEach((num, index) => {
            x.push(String(index));
            y.push(String(num));
        });

        // Load data as table
        calculator.controller.dispatch({
            type: 'paste-table',
            data: [x, y]
        });

        // Get newest expression
        let expression = calculator.getExpressions()[0];

        // Enable lines
        calculator.controller.dispatch({
            type: 'set-tablecolumn-lines',
            columnId: expression.columns[1].id,
            tableId: expression.id,
            bool: true
        });
        
        // Enable points
        calculator.controller.dispatch({
            type: 'set-tablecolumn-points',
            columnId: expression.columns[1].id,
            tableId: expression.id,
            bool: true
        });
    }
}

let sim = new Player();
sim.run(0, 10000);