'use strict'

document.addEventListener("DOMContentLoaded", () => {
    const moodSelect = document.getElementById("mood");
    const noteInput = document.getElementById("note");
    const saveButton = document.getElementById("saveMood");
    const moodList = document.getElementById("moodList");
    const clearButton = document.getElementById("clearAll");
    const moodChartCanvas = document.getElementById("moodChart");

    let moodData = JSON.parse(localStorage.getItem('moods')) || [];

    function saveMood() {
        const mood = moodSelect.value;
        const note = noteInput.value.trim();
        if (!note) return;

        const date = new Date().toLocaleString();

        moodData.push({date, mood, note});
        localStorage.setItem('moods', JSON.stringify(moodData));
        
        noteInput.value = "";
        
        renderMoods();  
    }
    
    function renderMoods() {
        moodList.innerHTML = "";

        moodData.forEach((entry, index) => {
            const li = document.createElement("li");
            li.textContent = `${entry.date} - ${entry.mood}: ${entry.note}`;
            li.style.display = "flex";
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.padding = '0 5px';
            li.style.borderBottom = "1px solid grey";
            li.style.textAlign = 'justify';

            const deleteButton = document.createElement('button');

            deleteButton.textContent = "x";
            deleteButton.style.display = 'flex';
            deleteButton.style.justifyContent = 'center';
            deleteButton.style.alignItems = 'center';
            deleteButton.style.marginLeft = '50px';
            deleteButton.style.backgroundColor = 'black';
            deleteButton.style.borderRadius = "50%";
            deleteButton.style.width = '35px';
            deleteButton.style.minWidth = '35px';
            deleteButton.style.height = '35px';
            deleteButton.style.color = "white";
            deleteButton.onclick = () => deleteMood(index);

            li.appendChild(deleteButton);
            moodList.appendChild(li);
        });
        renderChart();
    }

    function deleteMood(index) {
        moodData.splice(index, 1);
        localStorage.setItem('moods', JSON.stringify(moodData));
        renderMoods();
    }

    //let moodChart;

    function getRandomColor() {
        return `hsl(${Math.random() * 360}, 70%, 60%)`;
    }

    function renderChart() {

        //if (moodChart) moodChart.destroy();

        const moodCounts = moodData.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc; 
        }, {});
   
        
        const labels = Object.keys(moodCounts);
        const data = Object.values(moodCounts);
        const colors = labels.map(() => getRandomColor());


        moodChart = new Chart(moodChartCanvas, {
            type: "bar", 
            data: {
                labels: labels, 
                datasets: [{
                    label: "Частота настроений",
                    data: data, 
                    backgroundColor: colors.map(color => color.replace('60%, 50%')), 
                    borderWidth: 1,
                }]
            }, 
            options: {
                responsive: true, 
                plugins: {
                    legend: {display: false}
                }
            }
        });
    }

    function clearAll() {
        localStorage.removeItem('moods');
        moodData = [];
        renderMoods();
    }

    saveButton.addEventListener('click', saveMood);
    clearButton.addEventListener('click', clearAll);
    renderMoods();
})