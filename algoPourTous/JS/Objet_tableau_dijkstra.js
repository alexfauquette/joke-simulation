function Tableau_Dijkstra(id_canvas, x0, y0, limX, limY, graphe){
	this.pinceau = document.getElementById(id_canvas).getContext("2d");

	//coordonnées initiales
	this.x0 = x0;
	this.y0 = y0;
	//distance du canvas alloué au dessin de ce tableau
	this.limX = limX;
	this.limY = limY;

	this.graphe = graphe;


	this.marge = 30;
	this.police1 = 40;
	this.pinceau.font = this.police1+'pt Calibri';

	while(this.police1 > 8 && (this.pinceau.measureText("Sommmet Antécédent Distance").width + 3*this.marge > this.limX) ){
		if(this.police1 == 9 && this.marge > 5){
			this.marge = this.marge - 2;
		}
		else{
			this.police1 = this.police1 - 1;
			this.pinceau.font = this.police1+'pt Calibri';
		}
	}

	this.y1 = this.y0 + 1.5*parseInt(this.pinceau.font);
	this.x1 = this.x0 + this.pinceau.measureText("Sommmet").width+this.marge;
	this.x2 = this.x1 + this.pinceau.measureText("Antécédent").width+this.marge;
	this.x3 = this.x2 + this.pinceau.measureText("Distance").width+this.marge;
	
	
	this.initialisation = function(){
		this.pinceau.clearRect(this.x0,this.y0,this.limX,this.limY);
		this.tableau = [];
		this.N = this.graphe.sommets.length;
		for(var i = 0 ; i < this.N ; i++){
			this.tableau.push([this.graphe.sommets[i] , "_" , "inf"]);
		}

		this.police2 = 2*this.police1;
		this.pinceau.font = this.police2+'pt Calibri';
		this.h = 1.5*parseInt(this.pinceau.font);
		while(this.police2>8 && this.N*this.h > this.limY-(this.y1-this.y0)){
			this.police2 = this.police2 - 1;
			this.pinceau.font = this.police2+'pt Calibri';
			this.h = 1.5*parseInt(this.pinceau.font);
		}

		this.pinceau.font = this.police1+'pt Calibri';
		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'middle';
		this.pinceau.fillStyle = "black";
		this.pinceau.strokeStyle = "black";
		this.pinceau.lineWidth = 2;
		this.pinceau.lineJoin = "round";
		this.pinceau.lineCap = "round";

		this.pinceau.fillText("Sommet", this.x0 + (this.x1-this.x0)/2 , this.y0 + (this.y1-this.y0)/2);
		this.pinceau.fillText("Antécédent", this.x1 + (this.x2-this.x1)/2 , this.y0 + (this.y1-this.y0)/2);
		this.pinceau.fillText("Distance", this.x2 + (this.x3-this.x2)/2 , this.y0 + (this.y1-this.y0)/2);
		
		this.pinceau.beginPath();
		this.pinceau.moveTo(this.x1, this.y0);
		this.pinceau.lineTo(this.x1, this.y1+this.N*this.h);
		this.pinceau.stroke();

		this.pinceau.beginPath();
		this.pinceau.moveTo(this.x2, this.y0);
		this.pinceau.lineTo(this.x2, this.y1+this.N*this.h);
		this.pinceau.stroke();

		
		this.pinceau.font = this.police2+'pt Calibri';
		for(var i = 0 ; i < this.N ; i++){
			this.pinceau.beginPath();
			this.pinceau.moveTo(this.x0, this.y1+this.h*i);
			this.pinceau.lineTo(this.x3, this.y1+this.h*i);
			this.pinceau.stroke();

			this.pinceau.fillText(this.tableau[i][0], this.x0 + (this.x1-this.x0)/2 , this.y1+this.h*(i+0.5));
			this.pinceau.fillText(this.tableau[i][1], this.x1 + (this.x2-this.x1)/2 , this.y1+this.h*(i+0.5));
			this.pinceau.fillText(this.tableau[i][2], this.x2 + (this.x3-this.x2)/2 , this.y1+this.h*(i+0.5));
		}



	}

	this.modifier = function(i, j, x, afficher){
		//replace la valeur dans la case (i,j) par x

		if(i >= 0 && i < this.N && j >=0 && j <=2){
			this.tableau[i][j] = x;

			if(afficher){
				var Xs = [this.x0, this.x1, this.x2, this.x3];
				var x1 = Xs[j];
				var x2 = Xs[j+1];
				var y = this.y1+this.h*i;

				this.pinceau.clearRect(x1, y, x2-x1, this.h);

				this.pinceau.font = this.police2+'pt Calibri';
				this.pinceau.textAlign = 'center';
				this.pinceau.textBaseline = 'middle';
				this.pinceau.fillStyle = "black";
				this.pinceau.strokeStyle = "black";
				this.pinceau.lineWidth = 2;
				this.pinceau.lineJoin = "round";
				this.pinceau.lineCap = "round";

				this.pinceau.fillText(this.tableau[i][j], x1 + (x2-x1)/2 , y+this.h/2);

				this.pinceau.beginPath();
				this.pinceau.moveTo(x2, y);
				this.pinceau.lineTo(x1, y);

				if(i < this.N-1){
					this.pinceau.moveTo(x2, y+this.h);
					this.pinceau.lineTo(x1, y+this.h);
				}

				if(j > 0){
					this.pinceau.moveTo(x1, y);
					this.pinceau.lineTo(x1, y+this.h);
				}

				if(j <2){
					this.pinceau.moveTo(x2, y);
					this.pinceau.lineTo(x2, y+this.h);
				}
				this.pinceau.stroke();
			}
		}
	}

	this.tracer = function(){
		this.pinceau.clearRect(this.x0,this.y0,this.limX,this.limY);
		this.N = this.tableau.length;

		this.pinceau.font = this.police1+'pt Calibri';
		this.pinceau.textAlign = 'center';
		this.pinceau.textBaseline = 'middle';
		this.pinceau.fillStyle = "black";
		this.pinceau.strokeStyle = "black";
		this.pinceau.lineWidth = 2;
		this.pinceau.lineJoin = "round";
		this.pinceau.lineCap = "round";

		this.pinceau.fillText("Sommet", this.x0 + (this.x1-this.x0)/2 , this.y0 + (this.y1-this.y0)/2);
		this.pinceau.fillText("Antécédent", this.x1 + (this.x2-this.x1)/2 , this.y0 + (this.y1-this.y0)/2);
		this.pinceau.fillText("Distance", this.x2 + (this.x3-this.x2)/2 , this.y0 + (this.y1-this.y0)/2);
		
		this.pinceau.beginPath();
		this.pinceau.moveTo(this.x1, this.y0);
		this.pinceau.lineTo(this.x1, this.y1+this.N*this.h);
		this.pinceau.stroke();

		this.pinceau.beginPath();
		this.pinceau.moveTo(this.x2, this.y0);
		this.pinceau.lineTo(this.x2, this.y1+this.N*this.h);
		this.pinceau.stroke();

		
		this.pinceau.font = this.police2+'pt Calibri';
		for(var i = 0 ; i < this.N ; i++){
			this.pinceau.beginPath();
			this.pinceau.moveTo(this.x0, this.y1+this.h*i);
			this.pinceau.lineTo(this.x3, this.y1+this.h*i);
			this.pinceau.stroke();

			this.pinceau.fillText(this.tableau[i][0], this.x0 + (this.x1-this.x0)/2 , this.y1+this.h*(i+0.5));
			this.pinceau.fillText(this.tableau[i][1], this.x1 + (this.x2-this.x1)/2 , this.y1+this.h*(i+0.5));
			this.pinceau.fillText(this.tableau[i][2], this.x2 + (this.x3-this.x2)/2 , this.y1+this.h*(i+0.5));
		}



	}


	this.peindre = function(i, couleur_fond, couleur_texte){
		//change la couleur du fond et du texte

		if(i >= 0 && i < this.N){

			var Xs = [this.x0, this.x1, this.x2, this.x3];
			var x1 = Xs[j];
			var x2 = Xs[j+1];
			var y = this.y1+this.h*i;

			this.pinceau.fillStyle = couleur_fond;
			this.pinceau.fillRect(this.x0, y, this.x3-this.x0, this.h);

			this.pinceau.font = this.police2+'pt Calibri';
			this.pinceau.textAlign = 'center';
			this.pinceau.textBaseline = 'middle';
				
			this.pinceau.strokeStyle = "black";
			this.pinceau.lineWidth = 2;
			this.pinceau.lineJoin = "round";
			this.pinceau.lineCap = "round";

			for(var j = 0 ; j < 3 ; j++){
				var x1 = Xs[j];
				var x2 = Xs[j+1];
				this.pinceau.fillStyle = couleur_texte;
				this.pinceau.fillText(this.tableau[i][j], x1 + (x2-x1)/2 , y+this.h/2);


				this.pinceau.fillStyle = "black";
				this.pinceau.strokeStyle = "black";

				this.pinceau.beginPath();
				this.pinceau.moveTo(x2, y);
				this.pinceau.lineTo(x1, y);

				if(i < this.N-1){
					this.pinceau.moveTo(x2, y+this.h);
					this.pinceau.lineTo(x1, y+this.h);
				}

				if(j > 0){
					this.pinceau.moveTo(x1, y);
					this.pinceau.lineTo(x1, y+this.h);
				}

				if(j <2){
					this.pinceau.moveTo(x2, y);
					this.pinceau.lineTo(x2, y+this.h);
				}
				this.pinceau.stroke();
			}
			
		}
	}
}

