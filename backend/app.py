import pandas as pd
import matplotlib.pyplot as plt
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import threading
import os

app = Flask(__name__)
CORS(app)

# Load your DataFrame (assuming your CSV file is named 'crop_yield.csv')
df = pd.read_csv('crop_yield.csv')
# color_map = plt.cm.get_cmap('YlGnBu')
def plot_rainfall(state):
    data = df[df['State'] == state][['Annual_Rainfall', 'Crop_Year']].sort_values(by='Annual_Rainfall', ascending=False)

    # colors = color_map(data['Annual_Rainfall'].values)
    # Create the plot here...
    plt.switch_backend('agg')
    plt.figure(figsize=(10, 8))
    y = data['Annual_Rainfall'].unique()
    x = data['Crop_Year'].unique()
    plt.figure(figsize=(20, 8))
    plt.bar(x, y, tick_label=x)
    plt.xlabel('Years(1997-2019)')
    plt.ylabel('Annual Rainfall (mm)')
    plt.title(f'Annual Rainfall in {state}')

    # To Add Notaion Over the bar 
    for i, v in enumerate(y):
        plt.text(x[i], v + 1, f'{v:.2f}', ha='center', va='bottom', fontweight='bold')


    # Save the plot image with the specified path
    plot_dir = os.path.join('static', 'plots')
    os.makedirs(plot_dir, exist_ok=True)
    plot_path = os.path.join(plot_dir, f'{state}_rainfall_plot.png')
    plt.savefig(plot_path)

    return plot_path

def State_rainfall(state):
    plot_thread = threading.Thread(target=plot_rainfall, args=(state,))
    plot_thread.start()


@app.route('/')
def index():
    return "Welcome to The Backend"


@app.route('/api/data', methods=['GET'])
def get_data():
    state = request.args.get('state')
    print('Received state:', state)  # Add this line for logging
    data = df[df['State'] == state][['Annual_Rainfall', 'Crop_Year']].sort_values(by='Annual_Rainfall', ascending=False)
    result = data.to_dict(orient='records')
    # print('Result:', result)  # Add this line for logging
    return jsonify(result)


@app.route('/api/states', methods=['GET'])
def get_unique_states():
    unique_states = df['State'].unique().tolist()
    return jsonify(unique_states)


@app.route('/api/rainfall_plot', methods=['GET'])
def get_rainfall_plot():
    state = request.args.get('state')
    plot_path = plot_rainfall(state)
    return jsonify({'plot_url': plot_path})


@app.route('/static/plots/<filename>')
def serve_plot(filename):
    plot_path = os.path.join('static', 'plots', filename)
    return send_file(plot_path, mimetype='image/png')


if __name__ == '__main__':
    app.run()
