import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Example of review data loaded from a JSON or CSV file
data = pd.read_json('reviews.json')

# Initialize the sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Analyze sentiment for each review
data['sentiment'] = data['review'].apply(lambda review: analyzer.polarity_scores(review)['compound'])

# Save the processed data
data.to_json('sentiment_reviews.json', orient='records')
