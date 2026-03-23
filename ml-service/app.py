import os
import io
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

# ============================================
# Load the CNN Model (same architecture as train.py)
# ============================================

class PneumoniaCNN(nn.Module):
    def __init__(self):
        super(PneumoniaCNN, self).__init__()
        
        self.conv1 = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.Conv2d(32, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25)
        )
        
        self.conv2 = nn.Sequential(
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25)
        )
        
        self.conv3 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25)
        )
        
        self.conv4 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),
            nn.Dropout2d(0.25)
        )
        
        self.adaptive_pool = nn.AdaptiveAvgPool2d((4, 4))
        
        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.Linear(256 * 4 * 4, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(512, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        x = self.conv1(x)
        x = self.conv2(x)
        x = self.conv3(x)
        x = self.conv4(x)
        x = self.adaptive_pool(x)
        x = self.fc(x)
        return x


# ============================================
# Flask Application
# ============================================

app = Flask(__name__)
CORS(app)

# Image preprocessing
inference_transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

# Load model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = PneumoniaCNN().to(device)
model_loaded = False

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'pneumonia_model.pth')

if os.path.exists(MODEL_PATH):
    try:
        checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=False)
        model.load_state_dict(checkpoint['model_state_dict'])
        model.eval()
        model_loaded = True
        print(f"✅ Model loaded successfully (Val Acc: {checkpoint.get('val_acc', 'N/A')}%)")
    except Exception as e:
        print(f"⚠️ Error loading model: {e}")
        print("Running in demo mode with random predictions")
else:
    print(f"⚠️ No model file found at {MODEL_PATH}")
    print("Running in demo mode. Train the model first using: python train.py <dataset_path>")


@app.route('/predict', methods=['POST'])
def predict():
    """Predict pneumonia from chest X-ray image."""
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read and preprocess image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        input_tensor = inference_transform(image).unsqueeze(0).to(device)
        
        if model_loaded:
            # Model prediction
            with torch.no_grad():
                output = model(input_tensor)
                probability = output.item()
            
            prediction = 'PNEUMONIA' if probability > 0.5 else 'NORMAL'
            confidence = probability if probability > 0.5 else (1 - probability)
            
            details = (
                f"The AI model analyzed the chest X-ray and "
                f"{'detected patterns consistent with pneumonia' if prediction == 'PNEUMONIA' else 'found no significant abnormalities'}. "
                f"The model confidence is {confidence*100:.1f}%."
            )
        else:
            # Demo mode - simulate prediction
            import random
            probability = random.uniform(0.3, 0.95)
            prediction = 'PNEUMONIA' if probability > 0.5 else 'NORMAL'
            confidence = probability if probability > 0.5 else (1 - probability)
            
            details = (
                f"⚠️ DEMO MODE: No trained model found. This is a simulated prediction. "
                f"Train the model with: python train.py <dataset_path>"
            )
        
        return jsonify({
            'prediction': prediction,
            'confidence': round(confidence, 4),
            'details': details,
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to process image: {str(e)}'}), 500


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model_loaded,
        'device': str(device),
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
