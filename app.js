// Budget Controller
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {

            var newItem, ID;

            ID = data.allItems[type][data.allItems[type].length -1].id + 1;

            if (type === "exp") {
                new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);

            return newItem; 
        
        }
    }

})();
  

 

// UI Controller
var UIController = (function() {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    }
    
    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,  // Will be either "inc or exp"
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
                
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})()

// Global App Controller
var controller = (function(budgetctrl, UICtrl) {

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem)

        document.addEventListener("keypress", function(event) {
        if (event.keyCode === 13 || event.which === 13 ) {
            ctrlAddItem()
        }
    })
    }

    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function() {
        // 1. Get the field input data
        var input = UICtrl.getinput();
        
        // 2. Add the item to the budget contoller
        var newItem = budgetctrl,addItem(input.type, input.description, input.value)

        // 3. Add the item to the UI

        // 4. Calculate the budget 

        // 5. Display the budget

        console.log("it works")

    };

    return {
        init: function() {
            setupEventListeners()
        }
    }

})(budgetController, UIController)

controller.init()

