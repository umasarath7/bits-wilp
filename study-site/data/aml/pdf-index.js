// AML — open-book page index for the consolidated exam PDF (CourseFiles/AML/Watermark_BITS_WILP_AML.pdf, 746 pages).
// Page ranges were read from the PDF's own page titles.

const R = (topic, s, pages, notes = "") => [topic, s, pages, notes];

const ROWS = [
  // ---- S1 Introduction (1–46)
  R("Course topics, textbooks, evaluation", "S1", "2", ""),
  R("What is ML; T-P-E learning tasks; spam filtering", "S1", "3–8", "Checkers example"),
  R("When to use ML; where ML fits", "S1", "9–10", ""),
  R("Applications and application domains", "S1", "11–19", "Classification vs regression applications, autonomous cars"),
  R("Types of learning: supervised, unsupervised, semi-supervised, RL, batch/online", "S1", "20–36", ""),
  R("Challenges: insufficient / non-representative data, data quality, irrelevant features", "S1", "37–42", ""),
  R("Model selection, testing and validation, cross-validation, hyperparameters", "S1", "43–46", ""),
  // ---- S2 End-to-end ML (47–144)
  R("Framing the problem; choice of model and performance metric (RMSE, MAE)", "S2", "47–53", "Housing prices"),
  R("Data, attributes, discrete vs continuous, attribute types (NOIR)", "S2", "54–63", "Asymmetric attributes p. 62"),
  R("Characteristics of data; dataset types (record, document, transaction, graph, ordered)", "S2", "64–73", ""),
  R("Data quality: noise, outliers, missing values, duplicates", "S2", "74–81", ""),
  R("Preprocessing: aggregation, sampling", "S2", "82–85", ""),
  R("Discretisation (unsupervised, supervised) and binarisation", "S2", "86–90", "Iris example"),
  R("Attribute transformation; curse of dimensionality; PCA; feature subset selection and creation", "S2", "91–96", ""),
  R("Summary statistics: frequency, mode, percentiles, mean, median, range, variance", "S2", "97–104", ""),
  R("Similarity and dissimilarity: Euclidean, Minkowski, correlation", "S2", "105–115", "Distance matrix p. 111"),
  R("Visualisation: histograms, box plots, Iris matrix, star plots, Chernoff faces", "S2", "116–127", ""),
  R("Software tools: notebooks, Colab, Python libraries", "S2", "128–134", ""),
  R("Housing notebook: histograms, correlations, cleaning, categorical data, test set", "S2", "135–144", ""),
  // ---- S3 (145–189)
  R("Model selection and training: regression and classification (MNIST)", "S3", "145–151", "Multiclass p. 151"),
  R("Model evaluation: confusion matrix, accuracy, imbalanced classes", "S3", "152–157", ""),
  R("Methods of evaluation: holdout, learning curves", "S3", "158–160", ""),
  R("ROC curve and how to construct it", "S3", "161–165", ""),
  R("Hyperparameter optimisation: by hand, grid search, random search, cross-validation", "S3", "166–173", ""),
  R("ML pipeline and MLOps: levels 0–2, CI/CD, data and model validation", "S3", "174–189", ""),
  // ---- S4 (190–265)
  R("Polynomial curve fitting, error function", "S4", "190–196", ""),
  R("Bias–variance", "S4", "197–198", ""),
  R("Regularisation (examples, M = 5 and M = 9)", "S4", "199–202, 246–254", ""),
  R("Linear regression, OLS, single feature, house-size data", "S4", "203–210", "Size / price table p. 206"),
  R("Cost function intuition, contour plots", "S4", "211–215", ""),
  R("Gradient descent and learning rate", "S4", "216–233", ""),
  R("Multiple features", "S4", "234–245", "House table p. 234"),
  R("Self study: normal equation; references", "S4", "255–265", ""),
  // ---- S5 (266–287)
  R("Logistic regression, sigmoid, hypothesis", "S5", "268–272", ""),
  R("Decision boundary", "S5", "273–274", ""),
  R("Cost function (log loss) and gradient descent", "S5", "275–278", ""),
  R("Multi-class: one-vs-all, one-vs-one", "S5", "279–282", ""),
  R("Applications; worked example (initial weights 1)", "S5", "283–287", ""),
  // ---- S6 (288–324)
  R("Classification, linear classifiers, generative vs discriminative", "S6", "288–293", ""),
  R("Bayes classifier and Bayes theorem; meningitis example", "S6", "294–300", "Second query p. 300"),
  R("Bayes for classification; tax-evasion data", "S6", "301–304", ""),
  R("Naïve Bayes classifier and estimating probabilities", "S6", "305–312", ""),
  R("Naïve Bayes applications: bag of words, text classification", "S6", "313–316", ""),
  R("Laplace smoothing; NewsGroups experiment", "S6", "317–320", ""),
  R("Practice: Naïve Bayes", "S6", "321–324", ""),
  // ---- S7 (325–364)
  R("Linear classifiers and maximum margin", "S7", "325–335", ""),
  R("Linear SVM mathematically; solving the optimisation (dual)", "S7", "336–340", ""),
  R("Noise, slack variables, soft vs hard margin, C", "S7", "341–347", ""),
  R("Non-linear SVMs, kernel trick, kernel functions", "S7", "348–355", ""),
  R("Multi-class; evaluation; batch gradient descent", "S7", "356–360", ""),
  R("Homework: hyperplane by hand, polynomial kernel", "S7", "361–364", ""),
  // ---- S9 (365–408)
  R("Decision trees, Hunt's algorithm, construction example", "S9", "365–369", ""),
  R("Splitting: impurity measures (Gini, entropy, error)", "S9", "370–373", ""),
  R("Information gain; binary / nominal / continuous splits", "S9", "374–379", ""),
  R("Hiring example: entropy and IG levels 1–3", "S9", "380–392", "IG(CGPA) = 0.3 p. 385"),
  R("Characteristics; missing data", "S9", "393–394", ""),
  R("Overfitting, model selection, pre- and post-pruning", "S9", "395–407", ""),
  R("ID3 summary", "S9", "408", ""),
  // ---- S10 (409–450)
  R("Combining learners: no free lunch, committees, base learners", "S10", "409–416", ""),
  R("Combining results: voting and fusion; polynomial committees", "S10", "417–419, 433–438", ""),
  R("Bagging and random forests", "S10", "420–423", ""),
  R("Boosting and AdaBoost", "S10", "424–431, 439–450", ""),
  // ---- S11 (451–495)
  R("Unsupervised learning; agglomerative hierarchical clustering; inter-cluster similarity", "S11", "451–464", ""),
  R("Hierarchical example; single link; algorithm", "S11", "465–468", ""),
  R("K-means: introduction, example, algorithm, derivation", "S11", "469–489", "C1 = {2, 3}… p. 471"),
  R("Multimodal data, mixture distributions, EM clustering", "S11", "490–495", ""),
  // ---- S12 (496–525)
  R("Linear classification; perceptron training rule; example", "S12", "496–501", ""),
  R("Delta rule; neurons; activations; neural networks", "S12", "502–508", ""),
  R("Backpropagation; batch vs stochastic GD", "S12", "509–519", ""),
  R("Introduction to deep learning", "S12", "520–525", ""),
  // ---- S13 CNN / RNN (526–595)
  R("Why not ANN for images (784,000 and 150,528,000 weights)", "S13", "527–533", ""),
  R("CNN definition, recognising 7, types of layers", "S13", "534–544", ""),
  R("Convolution operation (6×6 example)", "S13", "545–549", "PDF slip: −2 should be 2"),
  R("Vertical and horizontal edge detectors", "S13", "550–552", ""),
  R("Fully connected layer; ANN vs CNN training", "S13", "553–555", ""),
  R("Padding (valid / same)", "S13", "558–562", "Same padding p = (f − 1)/2"),
  R("Stride (7×7 example)", "S13", "563–566", "PDF output inconsistent"),
  R("Number of parameters (28 per 3×3×3 filter)", "S13", "567", ""),
  R("Pooling: max and average", "S13", "568–572", ""),
  R("LeNet-5, AlexNet, VGG-16", "S13", "573–577", ""),
  R("Recurrent neural networks, unfolding, applications", "S13", "578–581", ""),
  R("Sequence modelling types; generating names; translation", "S13", "582–592", ""),
  R("Character-RNN data processing", "S13", "593–595", ""),
  // ---- S14 Clustering in depth (596–702)
  R("Clustering concepts, applications, types, methods comparison", "S14", "599–609", ""),
  R("Partitioning methods; distance measures", "S14", "611–612", ""),
  R("K-means concepts, algorithm, strengths and weaknesses", "S14", "614–622", ""),
  R("K-means problem A–E; 1-D example", "S14", "623–626", ""),
  R("Initial centroids; choosing k (√(n/2), elbow)", "S14", "627–628", ""),
  R("Elbow method numerical", "S14", "629–633", "k = 3"),
  R("K-means pre/post-processing and limitations", "S14", "634–637", ""),
  R("Hierarchical clustering, agglomerative vs divisive, dendrogram", "S14", "639–645", ""),
  R("Linkage measures: single, complete, average", "S14", "646–651", ""),
  R("Single linkage problem", "S14", "652–659", ""),
  R("Average linkage problem (unsolved in PDF)", "S14", "660", ""),
  R("Complete linkage problem", "S14", "661–668", ""),
  R("Density-based clustering, DBSCAN concepts", "S14", "670–678", ""),
  R("DBSCAN numerical problem", "S14", "679–683", ""),
  R("Cluster evaluation tasks; clustering tendency", "S14", "685–688", ""),
  R("Hopkins statistic numerical", "S14", "689–691", "H = 0.41"),
  R("Number of clusters; extrinsic methods; BCubed", "S14", "692–696", ""),
  R("Intrinsic methods; silhouette coefficient numerical", "S14", "697–701", ""),
  // ---- S15 FAccT (703–746)
  R("FAccT: fairness, accountability, transparency, privacy, security", "S15", "703–709", ""),
  R("Fairness, model sensitivity, Simpson's paradox", "S15", "710–714", ""),
  R("Real-world examples, COMPAS, bias in historical data", "S15", "715–719", ""),
  R("Fairness through unawareness; indirect evidence", "S15", "720–721", ""),
  R("Demographic parity, equality of odds, equality of opportunity", "S15", "722–725", ""),
  R("Practice question: predictors Ŷ1 and Ŷ2", "S15", "726–743", ""),
  R("Summary of fairness criteria; recap", "S15", "744–745", ""),
];

export default {
  title: "Find It in the PDF (open-book page index)",
  source: `${ROWS.length} topics · Watermark_BITS_WILP_AML.pdf (746 pages)`,
  overview:
    "In the open-book exam you'll have the consolidated AML PDF. Search here for a topic (“DBSCAN”, “pooling”, “Laplace”), a session (“S13”) or a keyword to jump straight to the right **PDF page numbers**. Sessions 13–15 cite these PDF pages directly; Sessions 1–12 cite their original decks, and each of their pages now shows its PDF page range in the source line. Note: the PDF has no separate Session 8 (revision) deck.",

  summary: [
    {
      id: "index",
      heading: "🔎 Search the PDF index",
      slides: "",
      blocks: [
        {
          type: "search",
          placeholder: "Search: e.g. SVM, S14, silhouette, padding, Gini…",
          head: ["Topic", "Session", "PDF pages", "Notes"],
          rows: ROWS,
        },
      ],
    },
  ],
};
