---
title: 'Note:Bayesian Detection'
date: '2017-05-23 11:14:58'
tags: 
- Bayesian

category: Research
image:
---

记录三篇与贝叶斯分类器物体检测算法的论文核心内容。

----
# Background Subtraction in Video using     Bayesian Learning with Motion Information 
## Advantages 
- Both high speed and high degree of sensitivity compared to existing techniques.

- Using Sum of Absolute Differences for segmentation to saving computational cost.

- Using sample-resample based Bayesian learning instead of traditional algorithm.

## Method and algorithm 
### Isolation of region of motion
Divided incoming frame into non-overlapping blocks of equal size.
Obtain the SAD between reference block and current block.
$$SAD=\Sigma_{i=1}^{X}\Sigma_{j=1}^{Y}(B_{t}(i,j)-B_{t-1}(i,j))$$
Use zero motion bias to determine whether it's region of motion or not, which can attenuate the effect of noise.

### Bayesian learning of cluster parameters 
- Draw N samples from K prior distribution.
Such as :

$$  \{\mu_{11},\mu_{12},...,\mu_{1N}\} $$

$$  \{\mu_{21},\mu_{22},...,\mu_{2N}\} $$

$$  \{\mu_{K1},\mu_{K2},...,\mu_{KN}\} $$

- Calculate prior distributions of each sample via Gaussian distribution center at $\mu_{ri}$with covariance matrix $\Sigma_{M}$.And compute the sum of each Mean distributions.

$$ l(\mu_{ri};x)=\frac{1}{(2\pi)^{\frac2n}|\Sigma_{M}|^{\frac12}}e^{-\frac12(x-\mu_{ri})^{T}\Sigma_{M}^{-1}(x-\mu_{ri})} $$

- The observation would belong to the cluster having the highest likelihood value.

- Compute weights for each sample $\mu_{to}$ when update r distribution.Resample each distribution using weighted bootstrap method to obtain posterior distributions $\{\mu_{r1}^{*},\mu_{r2}^{*},...,\mu^{*}_{rN}\}$

- Repeat for every observation of the pixel process.

### Classification of pixel observations into background and foreground 
The prior weight of any background cluster would be higher than of a foreground one,so they order the prior weight and choose background cluster based on a certain threshold Th.
$$B=arguing_{b}(\Sigma^{b}_{k=1}\omega_{k}>Th)$$
The pixels which are not in the region of motion would be classified as background.

# Bayesian Background Modeling for Foreground Detection 
## Advantages 
- Model each pixel as a set of layered normal distributions.
- Use Recursive Bayesian estimation to update the background parameters.
- Preserve multimodality of the background process.
- Determine the number of necessary layers by embedded confidence score.
- Unique Shadow Classify Algorithm.

## Method and algorithm 
### Background segmentation 
- Joint prior density as $p(\mu,\Sigma)=p(\mu|\Sigma)p(\Sigma)$ to perform recursive Bayesian estimation with new observation.
- Assume inverse Wishart distribution for covariance and multivariate distribution for mean.

$\Sigma~Inv-Wishart_{v_{t-1}}(\Lambda_{t-1}^{-1})$,  $\mu|\Sigma~N(\theta_{t-1},\Sigma/k_{t-1})$

- So joint posterior density becomes normal-inverse-Wishart
$(\theta_{t},\Lambda_{t}/k_{t};v_{t},\Lambda_{t})$
- Start the system with initial parameters:$k_{0}=10, v_{0}=10, \theta_{0}=x_{0}, \Lambda_{0}=(v_{0}-4)16^{2}I$
- For each pixel:
> while i<k:
>> measure Mahalanobis distance:
>>> $d_{i}=(x-\mu_{t-1,i})^{T}\Sigma^{-1}_{t-1,i}(x-\mu_{t-1,i})$
>>>
>>> if sample x is 99% confidence interval:
>>>> $\quad v_{t}=v_{t-1}+n   k_{t}=k_{t-1}+n$
>>>> $\quad \theta_{t}=\theta_{t-1}\frac{k_{t-1}}{k_{t-1}+n}+\overline{x}\frac{n}{k_{t-1}+n}$
>>>> $\quad \Lambda_{t}=\Lambda_{t-1}+\Sigma^{n}_{i=1}(x_{i}-\overline{x})(x_{i}-\overline{x})^{T}+n\frac{k_{t}-1}{k_{t}}(\overline{x}-\theta_{t-1})(\overline{x}-\theta_{t-1})^{T}$
>>>
>>> else:
>>>> $\quad k_{t}=k_{t-1}-n$
>>>>
>>>> $i=i +1$
>>>
>> Delete layer k, initialize a new layer.

- Embedded confidence score determines the number of layers to be used and prevents unnecessary layers.
$C=\frac{1}{|\Sigma_{\mu|x}|}=\frac{k_{t}^{3}(v_{t}-2)^{4}}{(v_{t}-4)|\Lambda_{t}|}$
- Order the layers according to C , use threshold $T_{c}$ to obtain confident layers.Then,measure the Mahalanobis distance of observed color from the confident layers. And Pixels that are outside of 99% confident interval of all confident layers of background would be regarded as foreground pixels.

### Shadow Classify 
- For each possible foreground pixel obtained, classify the pixel as shadow if it satisfies the condition:$\phi<min(\phi_{B},\phi_{0}), r_{1}<r<r_{2}$
  In the equation, $\phi$is the angle between luminance curve of background and selected pixel and r is a luminance ratio defined as$r=|B^{*}_{t}(p)|/h$
- Refine the shadow pixel by evaluating their local neighborhoods.Count the number of foreground, shadow and unclassified pixels for the center pixel to determine which type the center pixel is.

# Bayesian Foreground and Shadow Detections in uncertain frame rate surveillance videos 
## Advantages 
- Introduce a statistical shadow model with a coresponding automatic parameters update procedure. It can be robust regarding the fore coming object in real world sense which usually have lower frame rate and image resolution.
- Introduce a non-object based, spatial description of the Foreground which can contribute to segmentation in lower frame rate videos.
- Show how microstructure analysis can be used in the proposed framework as additional feature components to improve the results.

## Method 
### Formal Model 
- assign a label $w_{s}$ to each pixel $\Phi={fg,bg,sh}$
- image data at pixel s is characterized by a 4 dimensional feature vector:
$$\overline{x_{s}}=[x_{L}(S),[x_{u}(S),[x_{v}(S),[x_{T}(S)]^{T}$$ T is a microstructural response.
- Based on Gaussian density function for background and shadow ,then obtain the models of color feature and microstructural feature.

### Foreground feature 
Evaluate the color distribution and based on the distribution generate the foreground probability value which is statistically characterized by the distribution of its neighborhood in the color domain.

### Set propose parameters for each feature.
### Use Markov Random Field(MRF) to enhance the accuracy of separation.

# Bayesian Modeling of Dynamic scenes for objects detection 
## Advantages

- Use background and foreground models competitively for objects detection instead of merely background difference method.

- Introduce MAP-MRF framework to make decisions based on spatial context instead of making decision directly by threshold.

- The proposition that modeling spatial uncertainty is important for real world deployment.

## Method 

### Joint domain-range background model 
Represent the p pixels in image as feature vector x which is consisted of image lattice (x,y) and color space (r,g,b). Compute the probability of each pixel-vector belonging to the background using the kernel density estimator.
$$P(x|\psi_{b})=n^{-1}\Sigma_{I=1}^{n}\phi_{H}(x-y_{I})$$
$$\phi_{H}(x)=|H|^{-1/2}(2\pi)^{-d/2}exp(-\frac12x^{T}H^{-1}x)$$
Where H is a symmetric positive definite d*d bandwidth matrix.
And they propose a wise algorithm to select a proper bandwidth estimation for H by minimizing the mean square error.

### Modeling foreground model
Foreground probability is expressed as a mixture of a uniform and the kernel density function:
$$P(x|\psi_{f})=\alpha\gamma+(1-\alpha)m^{-1}\Sigma_{i=1}^{m}\phi_{H}(x-z{i })$$
Where $\alpha$is the mixture weight and $\gamma$ is a random variable with uniform probability.
Use interesting pixel to update $\phi_{f}$ and use all pixel to update $\phi_{b}$.Then, using a simple likelihood ratio classifier to describe the competition :
$$\tau=-ln\frac{P(x|\phi_{b})}{P(x|\phi_{f})}$$
And use a threshold k to balance the trade-off between sensitivity to change and robustness to noise.

### Estimation based on MAP-MRF framework 
- Obtain the set of neighborhood with a radius r from site i=(i ,j),using Euclidean distance and four-neighborhood cliques as neighborhood.

- For Bayes Law:
$$l(x|L)=\Pi_{i=1}^{p}f(x_{i}|l_{i})=\Pi_{i=1}^{p}f(x_{i}|\phi_{f})^{l_{i}}f(x_{i}|\phi_{b})^{l_{1-i}}$$

- Use Ising Model for MRF prior probability:
$$p(L)=exp(\Sigma_{i=1}^{p}\Sigma_{j=1}^{p}\lambda(l_{i}l_{j}+(1-l_{i})(1-l_{j})))$$

- Then get the posterior probability:
$$ln(p(L|x))=\Sigma_{i=1}^{p}ln(\frac{f(x_{i}|\psi_{f})}{f(x_{i}|\psi_{b})})l_{i}+\Sigma_{i=1}^{p}\Sigma_{j=1}^{p}\lambda(l_{i}l_{j}+(1-l_{i})(1-l_{j}))$$
