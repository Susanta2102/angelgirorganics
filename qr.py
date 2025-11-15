import qrcode

# Your website link
url = "https://angelgirorganics.netlify.app/"

# Generate QR Code
qr = qrcode.make(url)

# Save the QR code as an image
qr.save("website_qr.png")
