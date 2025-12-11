# 💰 Advanced Expense Tracker

A feature-rich, responsive expense tracking application with budget management, multi-currency support, and detailed analytics. Built with vanilla JavaScript and Chart.js for optimal performance.

![Expense Tracker Preview](preview.png)

## ✨ Features

### Core Functionality
- ➕ **Add & Edit Expenses** - Track all your spending with detailed categorization
- 🗑️ **Delete with Confirmation** - Safe deletion with modal confirmation
- 🔍 **Advanced Filtering** - Search by title, category, type, or time period
- 💾 **Persistent Storage** - Data saved automatically across sessions

### Budget Management
- 💰 **Category Budgets** - Set monthly spending limits for each category
- 📊 **Budget Progress** - Visual progress bars with color-coded warnings
- ⚠️ **Budget Alerts** - Green → Yellow (80%) → Red (100%) indicators
- 📈 **Real-time Tracking** - Monitor spending against budgets instantly

### Multi-Currency Support
- 🌍 **5 Major Currencies** - INR, USD, EUR, GBP, JPY
- 🔄 **Auto Conversion** - Automatic conversion to base currency (INR)
- 💱 **Exchange Rates** - Built-in conversion rates
- 📊 **Unified Analytics** - All charts show converted values

### Analytics & Insights
- 📈 **Spending Trends** - Line chart showing daily spending patterns
- 🥧 **Type Breakdown** - Doughnut chart for Required vs Optional
- 📊 **Category Analysis** - Bar chart for category-wise spending
- 📉 **Statistics Dashboard** - Total, average, and top category insights

### Data Management
- 📤 **CSV Export** - Download all expenses with full details
- 📥 **CSV Import** - Bulk import from CSV files
- 🔄 **Recurring Expenses** - Mark and track monthly recurring costs
- 💾 **Auto-save** - Changes saved automatically

### User Experience
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, glassmorphic design with smooth animations
- 🌈 **Visual Feedback** - Toast notifications for all actions
- ⚡ **Fast Performance** - No frameworks, pure vanilla JavaScript

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. **Open in browser**
```bash
# Simply open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

3. **For Claude.ai deployment**
- Copy the entire HTML file content
- Paste into Claude.ai as an artifact
- Enjoy persistent storage!

## 📖 Usage Guide

### Adding Expenses
1. Click **"Add Expense"** tab
2. Enter expense details (title, amount, date, category)
3. Select currency from dropdown
4. Choose type (Required/Optional)
5. Check "Recurring" if it's a monthly expense
6. Click **"Add Expense"**

### Setting Budgets
1. Click **"Set Budget"** tab
2. Select category
3. Enter budget amount and currency
4. Click **"Set Budget"**
5. View budget status in right panel

### Importing Data
1. Click **"Import"** tab
2. Prepare CSV file with format:
```
   Title,Amount,Date,Category,Type,Currency,Recurring
   Groceries,500,2024-12-10,Food,required,₹,false
```
3. Upload CSV file
4. System automatically imports expenses

### Filtering & Search
- **Search Box**: Find expenses by title
- **Category Filter**: View specific category
- **Type Filter**: Required or Optional only
- **Month Filter**: This month, last month, or all time

### Exporting Data
- Click **"Export CSV"** button (top-right)
- Downloads CSV with all expense data
- Can be re-imported later

## 🛠️ Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with modern features (Grid, Flexbox, Animations)
- **Charts**: Chart.js v3
- **CSV Parsing**: PapaParse v5
- **Storage**: Window Storage API (persistent)
- **Fonts**: Google Fonts (Poppins)

## 📂 Project Structure
```
expense-tracker/
├── index.html          # Main HTML file (all-in-one)
├── README.md           # This file
├── preview.png         # Screenshot
└── sample_import.csv   # Sample CSV for testing
```

## 🎨 Color Scheme

- Primary Blue: `#2d61ff`
- Success Green: `#00d4aa`
- Warning Orange: `#ffa502`
- Danger Red: `#ff6b6b`
- Background: Gradient `#d4e4ff` → `#a8c7ff`
- Cards: Glassmorphic with `rgba(255,255,255,0.45)`

## 📱 Responsive Breakpoints

- **Large Desktop**: 1400px+ (expanded layout)
- **Desktop**: 1024px - 1400px (standard 2-column)
- **Tablet**: 768px - 1024px (single column, optimized)
- **Mobile**: 480px - 768px (stacked layout)
- **Small Mobile**: < 480px (compact design)

## 🔮 Future Enhancements

- [ ] Dark mode toggle
- [ ] Bill reminders/notifications
- [ ] Receipt image upload
- [ ] Multiple user accounts
- [ ] Advanced analytics (weekly/monthly reports)
- [ ] Budget recommendations using AI
- [ ] Export to PDF
- [ ] Integration with bank APIs
- [ ] Expense tags/labels
- [ ] Split expenses with friends

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- PapaParse for CSV parsing
- Google Fonts for Poppins font
- Claude AI for development assistance

## 📧 Contact

Have questions or suggestions? Open an issue or reach out!

---

⭐ **Star this repo if you find it helpful!** ⭐
