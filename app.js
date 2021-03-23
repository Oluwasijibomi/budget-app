//BUDGET CONTROLLER

var budgetController = (function() {


    // CREATE OBJESCCT PROTOTYPE
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

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(curr) {
            sum = sum + curr.value;
        });

        data.totals[type] = sum;
    }


    // CREATE DATA STRUCTURE
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
 
        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1
    };


    // MAKE THE DATA AVAILABLE FOR THE APP CONTROLLER
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            // Create new ID

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;

            } else {
                ID = 0;
            }
            
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

            calculateBudget: function() {

                // calculate total income and expenses
                calculateTotal("exp");
                calculateTotal("inc");
                // calculate the budget: income-expenses

                data.budget = data.totals.inc - data.totals.exp;

                //calculate the percentage of income tha we spent

                if (data.totals.inc > 0) {
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                } else {
                    data.percentage = -1;
                }
               
            },

            getBudget: function() {
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalexp: data.totals.exp,
                    percentage: data.percentage
                };
            }, 
    };

})()

// UI CONTROLLER

var UIController = (function() {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list"
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListitem: function(obj, type) {

            var html, newHtml, element;
            // CREATE HTML STRING WITH PLACEHOLDER TEXT

            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }


            // REPLACE THE PLACEHOLDER TEXT WITH SOME ACTUAL DATA
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            // INSERT HTML INTO THE DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml)
        },


        clearFields: function() {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            })

            fieldsArray[0].focus();
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})()

// APP CONTROLLER

var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(event) {
        if (event.keyCode === 13 || event.which === 13) {

            ctrlAddItem()
        }
    })
    };


    var updateBudget = function() {
          // 1. calculate the budget
            budgetCtrl.calculateBudget()
          // 2. Return the budget

          var budget = budgetCtrl.getBudget()

        // 3. Display the budget on the UI

        console.log(budget)
    }

    var ctrlAddItem = function () {

        // 1. Get the input data
        var input = UICtrl.getInput()
        

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListitem(newItem, input.type);

        // CLEAR FIELDS
        UICtrl.clearFields();

        // CALCULATE AND UPDATE BUDGET
        updateBudget()
        }
        
    }

    return {
        init: function() {
            setUpEventListeners()
        }
    }

})(budgetController, UIController)


controller.init()