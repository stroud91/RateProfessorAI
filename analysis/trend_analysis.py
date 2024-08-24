import pandas as pd
import matplotlib.pyplot as plt

# Load the sentiment-analyzed data
data = pd.read_json('sentiment_reviews.json')

# Convert dates to pandas datetime objects (assuming you have a date field)
data['date'] = pd.to_datetime(data['date'])

# Group data by date to calculate average sentiment over time
sentiment_trend = data.groupby(data['date'].dt.to_period('M')).mean()

# Plot the trend
plt.figure(figsize=(10, 6))
plt.plot(sentiment_trend.index.to_timestamp(), sentiment_trend['sentiment'], marker='o')
plt.title('Sentiment Trend Over Time')
plt.xlabel('Date')
plt.ylabel('Average Sentiment')
plt.grid(True)
plt.show()
